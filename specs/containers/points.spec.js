/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { concat, slice } from "lodash"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import Button from "../../src/setUp/components/button"
import DataTable from "../../src/setUp/components/dataTable"
import { InputField, InputLabel } from "../../src/setUp/components/input"
import Points from "../../src/setUp/containers/points"
import PointForm from "../../src/setUp/components/pointForm"
import pointsData from "../testData/points.json"
import Title from "../../src/setUp/components/title"
const pointsActions = require("../../src/setUp/actions/pointsActions")


describe("Points", () => {
  describe("contains", () => {
    it("a title", () => {
      const points = shallow(<Points />)
      expect(points.find(Title)).to.have.length(1)
      expect(points.find(Title).childAt(0).text()).to.equal("Points:")
    })

    it("a table with the expected headers", () => {
      const headers = ["name", "X", "Y", "Z"]
      const points = mount(<Points />)
      expect(points.find(DataTable)).to.have.length(1)
      const tableHeaders = points
        .find(DataTable).at(0)
        .find("tr").at(0)
        .find("th").map(header => header.text())
      expect(tableHeaders).to.deep.equal(headers)
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

    it("calls componentDidMount and getPoints", () => {
      const componentDidMount = sinon.spy(Points.prototype, "componentDidMount")
      mount(<Points backend={ backend } />)
      expect(Points.prototype.componentDidMount.calledOnce).to.equal(true)
      sinon.assert.calledOnce(global.getMockPoints)
      sinon.assert.calledWith(global.getMockPoints, { backend })
      componentDidMount.restore()
    })

    it("stores points retrieved from the backend in state", done => {
      const points = mount(<Points backend={ backend } />)
      expect(points.state("points")).to.deep.equal([])
      sinon.assert.calledOnce(global.getMockPoints)
      sinon.assert.calledWith(global.getMockPoints, { backend })
      setImmediate(() => {
        const storedPoints = JSON.stringify(points.state("points"))
        const expectedPoints = JSON.stringify(pointsData)
        expect(storedPoints).to.equal(expectedPoints)
        done()
      })
    })

    it("renders points that are present in state", () => {
      const points = mount(<Points backend={ backend } />)
      expect(points.props().backend).to.equal(backend)
      points.setState({ points: pointsData })
      const displayedPoints = points
        .find(DataTable).at(0)
        .find("tr")
        .map(row => row.find("td").map(data => data.text()))
      expect(slice(displayedPoints, 1)).to.deep.equal(pointsData.map(point => [
        point.name,
        point.trueCoordinateX.toString(),
        point.trueCoordinateY.toString(),
        point.trueCoordinateZ.toString(),
        "Delete"
      ]))
    })

    it("sets loaded state to true when points have been retrieved from the backend", done => {
      const points = mount(<Points backend={ backend } />)
      expect(points.state("loaded")).to.equal(false)
      setImmediate(() => {
        expect(points.state("loaded")).to.equal(true)
        done()
      })
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
      expect(points.state("showPointForm")).to.equal(false)
      setImmediate(() => {
        const createPointButton = points
          .find(Button)
          .filterWhere(button => button.text() === "Add Point")
        createPointButton.simulate("click")
        expect(points.state("showPointForm")).to.equal(true)
        done()
      })
    })

    it("displays a point form when add point button is pushed", done => {
      const points = mount(<Points backend={ backend } />)
      setImmediate(() => {
        expect(points.find(PointForm)).to.have.length(0)
        const createPointButton = points
          .find(Button)
          .filterWhere(button => button.text() === "Add Point")
        createPointButton.simulate("click")
        expect(points.find(PointForm)).to.have.length(1)
        done()
      })
    })

    it("submits new point to backend when filled form is submitted", done => {
      const points = mount(<Points backend={ backend } />)
      setImmediate(() => {
        expect(points.find(PointForm)).to.have.length(0)
        const createPointButton = points
          .find(Button)
          .filterWhere(button => button.text() === "Add Point")
        createPointButton.simulate("click")
        expect(points.find(PointForm)).to.have.length(1)
        const pointNameInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        const pointXInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "X")
          .find(InputField)
        const pointYInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Y")
          .find(InputField)
        const pointZInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Z")
          .find(InputField)
        pointNameInputField.simulate("change", { target: { value: "point1" } })
        pointXInputField.simulate("change", { target: { value: 1 } })
        pointYInputField.simulate("change", { target: { value: 1 } })
        pointZInputField.simulate("change", { target: { value: 2 } })
        points.find(PointForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockPoint)
        sinon.assert.calledWith(
          global.setMockPoint,
          {
            backend,
            point: {
              name: "point1",
              trueCoordinateX: 1,
              trueCoordinateY: 1,
              trueCoordinateZ: 2
            }
          }
        )
        done()
      })
    })

    it("hides point form when onSubmitted is called", done => {
      const points = mount(<Points backend={ backend } />)
      setImmediate(() => {
        expect(points.find(PointForm)).to.have.length(0)
        const createPointButton = points
          .find(Button)
          .filterWhere(button => button.text() === "Add Point")
        createPointButton.simulate("click")
        expect(points.find(PointForm)).to.have.length(1)
        const pointNameInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        const pointXInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "X")
          .find(InputField)
        const pointYInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Y")
          .find(InputField)
        const pointZInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Z")
          .find(InputField)
        pointNameInputField.simulate("change", { target: { value: "point1" } })
        pointXInputField.simulate("change", { target: { value: 1 } })
        pointYInputField.simulate("change", { target: { value: 1 } })
        pointZInputField.simulate("change", { target: { value: 2 } })
        points.find(PointForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockPoint)
        setImmediate(() => {
          expect(points.state("showPointForm")).to.equal(false)
          expect(points.find(PointForm)).to.have.length(0)
          done()
        })
      })
    })

    it("reloads points when onSubmitted is called", done => {
      const points = mount(<Points backend={ backend } />)
      setImmediate(() => {
        expect(points.find(PointForm)).to.have.length(0)
        const createPointButton = points
          .find(Button)
          .filterWhere(button => button.text() === "Add Point")
        createPointButton.simulate("click")
        expect(points.find(PointForm)).to.have.length(1)
        const pointNameInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        const pointXInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "X")
          .find(InputField)
        const pointYInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Y")
          .find(InputField)
        const pointZInputField = points
          .find(PointForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "Z")
          .find(InputField)
        pointNameInputField.simulate("change", { target: { value: "point3" } })
        pointXInputField.simulate("change", { target: { value: 3 } })
        pointYInputField.simulate("change", { target: { value: 2 } })
        pointZInputField.simulate("change", { target: { value: 4 } })
        global.getMockPoints.restore()
        global.getMockPoints = sinon.stub(pointsActions, "getPoints")
          .resolves(concat(
            pointsData,
            {
              name: "point3",
              trueCoordinateX: 3,
              trueCoordinateY: 2,
              trueCoordinateZ: 4
            }
          ))
        proxyquire(
          "../../src/setUp/containers/points",
          { getPoints: { getPoints: global.getMockPoints } }
        )
        points.find(PointForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockPoint)
        setImmediate(() => {
          sinon.assert.calledOnce(global.getMockPoints)
          const storedPoints = JSON.stringify(points.state("points"))
          const expectedPoints = JSON.stringify(concat(
            pointsData,
            {
              name: "point3",
              trueCoordinateX: 3,
              trueCoordinateY: 2,
              trueCoordinateZ: 4
            }
          ))
          expect(storedPoints).to.equal(expectedPoints)
          done()
        })
      })
    })
  })
})
