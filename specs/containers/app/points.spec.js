/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/setUp/containers/app"
import { backend } from "../../../src/constants"
import DataTable from "../../../src/setUp/components/dataTable"
import experimentsData from "../../testData/experiments.json"
import Params from "../../../src/setUp/containers/params"
import nodesData from "../../testData/nodes.json"
import pointsData from "../../testData/points.json"
import { addParam } from "../../helpers/appHelpers"
import { findButtonByName } from "../../helpers/findElements"
import { getPoints, setPoint } from "../../../src/setUp/actions/pointsActions"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")


describe("App Points", () => {
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    it("points when show state is \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "points" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "point"))
        .to.have.length(1)
    })

    it("no points when show state is not \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "point"))
        .to.have.length(0)
    })
  })

  describe("when points tab is active", () => {
    let setMockPoint
    let deleteMockPoint

    beforeEach(() => {
      setMockPoint = sinon.stub(pointsActions, "setPoint")
        .resolves({
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        })
      proxyquire("../../../src/setUp/containers/app", { setPoint: setMockPoint })
      deleteMockPoint = sinon.stub(pointsActions, "deletePoint").resolves({
        name: "point1",
        X: 1,
        Y: 1,
        Z: 2
      })
      proxyquire("../../../src/setUp/containers/app", { deletePoint: deleteMockPoint })
    })

    afterEach(() => {
      setMockPoint.restore()
      deleteMockPoint.restore()
    })

    it("expected props are sent to params", done => {
      const pointFields = [
        { name: "name", type: "text" },
        { name: "X", type: "text" },
        { name: "Y", type: "text" },
        { name: "Z", type: "text" }
      ]
      const props = {
        backend,
        title: "Points:",
        get: getPoints,
        set: setPoint,
        paramName: "point",
        createText: "Add Point"
      }
      const copyProps = { fields: pointFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("points")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        sinon.assert.calledTwice(getMockPoints)
        sinon.assert.calledWith(getMockPoints, { backend })
        done()
      })
    })

    it("when a point is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        sinon.assert.calledTwice(getMockPoints)
        const data = {
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        }
        setImmediate(() => {
          addParam({ mountedComponent: app, paramName: "point", createText: "Add Point", data })
          sinon.assert.calledOnce(setMockPoint)
          sinon.assert.calledWith(setMockPoint, { backend, point: data })
          done()
        })
      })
    })

    it("when a point is deleted delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        point: {
          name: "point1",
          X: 1,
          Y: 1,
          Z: 2
        }
      }
      const dataTable = app
      app.setState({ show: "points" })
      app.find(Params)
        .filterWhere(params => params.props().paramName === "point")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteMockPoint)
        sinon.assert.calledWith(deleteMockPoint, callArgs)
        done()
      })
    })
  })
})
