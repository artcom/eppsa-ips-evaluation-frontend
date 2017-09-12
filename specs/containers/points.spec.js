/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { concat } from "lodash"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import Button from "../../src/setUp/components/button"
import Points from "../../src/setUp/containers/points"
import PointForm from "../../src/setUp/components/pointForm"
import pointsData from "../testData/points.json"
import {
  acknowledgeRetrieval,
  activateForm,
  activateOnSelect,
  callDeleteData,
  callsMountFunctions,
  displayInTable,
  hasTable,
  hasTitle,
  hideForm,
  reloadData,
  showForm,
  storeDataInState,
  submitData
} from "../helpers/paramsHelpers"
const pointsActions = require("../../src/setUp/actions/pointsActions")


describe("Points", () => {
  describe("contains", () => {
    it("a title", () => {
      hasTitle(shallow(<Points />), "Points:")
    })

    it("a table with the expected headers", () => {
      const headers = ["name", "X", "Y", "Z"]
      const points = mount(<Points />)
      hasTable(points, headers)
    })

    it("no create point button when loaded state is false", () => {
      const points = shallow(<Points />)
      expect(points.state("loaded")).to.equal(false)
      expect(points.find(Button)).to.have.length(0)
    })

    it("a create point button when loaded state is true", () => {
      const points = shallow(<Points />)
      points.setState({ loaded: true })
      expect(points.find(Button)).to.have.length(1)
      expect(points.find(Button).childAt(0).text()).to.equal("Add Point")
    })
  })

  describe("for retrieval", () => {
    beforeEach(() => {
      global.getMockPoints = sinon.stub(pointsActions, "getPoints")
        .resolves(pointsData)
      proxyquire(
        "../../src/setUp/containers/points",
        { getPoints: { getPoints: global.getMockPoints } }
      )
    })

    afterEach(() => {
      global.getMockPoints.restore()
    })

    it("calls componentDidMount and getPoints and passes the expected props to Points", () => {
      callsMountFunctions(Points, { backend }, global.getMockPoints, { backend })
    })

    it("stores points retrieved from the backend in state", done => {
      const points = mount(<Points backend={ backend } />)
      storeDataInState(points, global.getMockPoints, "points", pointsData, done)
    })

    it("renders points that are present in state", () => {
      const points = mount(<Points backend={ backend } />)
      const expectedRows = pointsData.map(point => [
        point.name,
        point.trueCoordinateX.toString(),
        point.trueCoordinateY.toString(),
        point.trueCoordinateZ.toString(),
        "Delete"
      ])
      displayInTable(points, { points: pointsData }, expectedRows)
    })

    it("sets loaded state to true when points have been retrieved from the backend", done => {
      const points = mount(<Points backend={ backend } />)
      acknowledgeRetrieval(points, global.getMockPoints, done)
    })
  })

  describe("for creation", () => {
    beforeEach(() => {
      global.getMockPoints = sinon.stub(pointsActions, "getPoints")
        .resolves(pointsData)
      proxyquire(
        "../../src/setUp/containers/points",
        { getPoints: { getPoints: global.getMockPoints } }
      )
      global.setMockPoint = sinon.stub(pointsActions, "setPoint")
        .resolves("point1")
      proxyquire(
        "../../src/setUp/components/pointForm",
        { setPoint: { setPoint: global.setMockPoint } }
      )
    })

    afterEach(() => {
      global.getMockPoints.restore()
      global.setMockPoint.restore()
    })

    it("sets showPointForm state to true when add point button is pushed", done => {
      const points = mount(<Points backend={ backend } />)
      activateOnSelect(points, "showPointForm", "Add Point", done)
    })

    it("displays a point form when add point button is pushed", done => {
      const points = mount(<Points backend={ backend } />)
      showForm(points, PointForm, "Add Point", done)
    })

    it("submits new point to backend when filled form is submitted", done => {
      const points = mount(<Points backend={ backend } />)
      const submitPoint = {
        name: "point1",
        X: 1,
        Y: 1,
        Z: 2
      }
      const callArgs = {
        backend,
        point: {
          name: "point1",
          trueCoordinateX: 1,
          trueCoordinateY: 1,
          trueCoordinateZ: 2
        }
      }
      submitData(points, PointForm, "Add Point", submitPoint, global.setMockPoint, callArgs, done)
    })

    it("hides point form when onSubmitted is called", done => {
      const points = mount(<Points backend={ backend } />)
      const submitPoint = {
        name: "point3",
        X: 3,
        Y: 2,
        Z: 4
      }
      hideForm(
        points,
        PointForm,
        submitPoint,
        "showPointForm",
        "Add Point",
        global.setMockPoint,
        done
      )
    })

    it("reloads points when onSubmitted is called", done => {
      const points = mount(<Points backend={ backend } />)
      const submitPoint = {
        name: "point3",
        X: 3,
        Y: 2,
        Z: 4
      }
      setImmediate(() => {
        activateForm(points, PointForm, "Add Point", submitPoint)
        global.getMockPoints.restore()
        const newData = concat(
          pointsData,
          {
            name: "point3",
            trueCoordinateX: 3,
            trueCoordinateY: 2,
            trueCoordinateZ: 4
          }
        )
        global.getMockPoints = sinon.stub(pointsActions, "getPoints")
          .resolves(newData)
        proxyquire(
          "../../src/setUp/containers/points",
          { getPoints: { getPoints: global.getMockPoints } }
        )
        reloadData(
          points,
          PointForm,
          "points",
          global.setMockPoint,
          global.getMockPoints,
          newData,
          done
        )
      })
    })
  })

  describe("for deletion", () => {
    beforeEach(() => {
      global.getMockPoints = sinon.stub(pointsActions, "getPoints")
        .resolves(pointsData)
      proxyquire(
        "../../src/setUp/containers/points",
        { getPoints: { getPoints: global.getMockPoints } }
      )
      global.deleteMockPoint = sinon.stub(pointsActions, "deletePoint")
        .resolves("point1")
      proxyquire(
        "../../src/setUp/containers/points",
        { deletePoint: { deletePoint: global.deleteMockPoint } }
      )
    })

    afterEach(() => {
      global.getMockPoints.restore()
      global.deleteMockPoint.restore()
    })

    it("calls deletePoint when delete button is pushed", done => {
      const points = mount(<Points backend={ backend } />)
      const deleteArgs = { backend, name: "point1" }
      callDeleteData(points, global.deleteMockPoint, deleteArgs, done)
    })
  })
})
