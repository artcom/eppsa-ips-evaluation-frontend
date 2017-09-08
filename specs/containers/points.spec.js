/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import Points from "../../src/setUp/containers/points"
import pointsData from "../testData/points.json"
import Title from "../../src/setUp/components/title"
const pointsActions = require("../../src/setUp/actions/pointsActions")
// const points = require("../testData/points.json")


describe("Points", () => {
  describe("contains", () => {
    it("a title", () => {
      const points = shallow(<Points />)
      expect(points.find(Title)).to.have.length(1)
      expect(points.find(Title).childAt(0).text()).to.equal("Points:")
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
  })
})
