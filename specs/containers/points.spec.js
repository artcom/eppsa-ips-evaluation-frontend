/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { slice } from "lodash"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import DataTable from "../../src/setUp/components/dataTable"
import Points from "../../src/setUp/containers/points"
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
        point.trueCoordinateZ.toString()
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
})
