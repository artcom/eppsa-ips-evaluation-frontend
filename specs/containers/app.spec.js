/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../src/setUp/containers/app"
import { backend } from "../../src/constants"
import experimentsData from "../testData/experiments.json"
import Params from "../../src/setUp/containers/params"
import nodesData from "../testData/nodes.json"
import pointsData from "../testData/points.json"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"
import {
  deleteExperiment,
  getExperiments,
  setExperiment
} from "../../src/setUp/actions/experimentsActions"
import { getNodes, setNode } from "../../src/setUp/actions/nodesActions"
import {
  getPoints,
  setPoint
} from "../../src/setUp/actions/pointsActions"
const experimentsActions = require("../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../src/setUp/actions/nodesActions")
const pointsActions = require("../../src/setUp/actions/pointsActions")


describe("App", () => {
  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("experiments when show state is \"experiments\"", () => {
      const app = shallow(<App />)
      expect(app.state("show")).to.equal("experiments")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "experiment"))
        .to.have.length(1)
    })

    it("no experiments when show state is not \"experiments\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "experiment"))
        .to.have.length(0)
    })

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

    it("nodes when show state is \"nodes\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "nodes" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "node"))
        .to.have.length(1)
    })

    it("no nodes when show state is not \"nodes\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "node"))
        .to.have.length(0)
    })
  })

  describe("activates", () => {
    it("Points when points tab is clicked", () => {
      const app = mount(<App />)
      expect(app.state("show")).to.equal("experiments")
      const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "Points")
      pointsTab.simulate("click")
      expect(pointsTab.props().highlight).to.equal(true)
      expect(app.state("show")).to.equal("points")
    })

    it("Nodes when nodes tab is clicked", () => {
      const app = mount(<App />)
      expect(app.state("show")).to.equal("experiments")
      const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "Nodes")
      nodesTab.simulate("click")
      expect(nodesTab.props().highlight).to.equal(true)
      expect(app.state("show")).to.equal("nodes")
    })
  })

  describe("when experiments tab is active", () => {
    beforeEach(() => {
      global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
        .resolves(experimentsData)
      proxyquire(
        "../../src/setUp/containers/params",
        { getExperiments: { getExperiments: global.getMockExperiments } }
      )
    })

    afterEach(() => {
      global.getMockExperiments.restore()
    })

    it("sends expected props to params", () => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "experiments" })
      expect(app.state("show")).to.equal("experiments")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).props().backend).to.equal(backend)
      expect(app.find(Params).props().title).to.equal("Experiments:")
      expect(JSON.stringify(app.find(Params).props().fields))
        .to.deep.equal(JSON.stringify([{ name: "name", type: "text" }]))
      expect(app.find(Params).props().get).to.equal(getExperiments)
      expect(app.find(Params).props().set).to.equal(setExperiment)
      expect(app.find(Params).props().delete).to.equal(deleteExperiment)
      expect(app.find(Params).props().paramName).to.equal("experiment")
      expect(app.find(Params).props().createText).to.equal("Create Experiment")
      sinon.assert.calledOnce(global.getMockExperiments)
    })
  })

  describe("when points tab is active", () => {
    beforeEach(() => {
      global.getMockPoints = sinon.stub(pointsActions, "getPoints")
        .resolves(pointsData)
      proxyquire(
        "../../src/setUp/containers/params",
        { getPoints: { getPoints: global.getMockPoints } }
      )
    })

    afterEach(() => {
      global.getMockPoints.restore()
    })

    it("sends expected props to params", () => {
      const pointFields = [
        { name: "name", type: "text" },
        { name: "X", type: "text" },
        { name: "Y", type: "text" },
        { name: "Z", type: "text" }
      ]
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "points" })
      expect(app.state("show")).to.equal("points")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).props().backend).to.equal(backend)
      expect(app.find(Params).props().title).to.equal("Points:")
      expect(JSON.stringify(app.find(Params).props().fields))
        .to.deep.equal(JSON.stringify(pointFields))
      expect(app.find(Params).props().get).to.equal(getPoints)
      expect(app.find(Params).props().set).to.equal(setPoint)
      expect(app.find(Params).props().paramName).to.equal("point")
      expect(app.find(Params).props().createText).to.equal("Add Point")
      sinon.assert.calledOnce(global.getMockPoints)
    })
  })

  describe("when nodes tab is active", () => {
    beforeEach(() => {
      global.getMockNodes = sinon.stub(nodesActions, "getNodes")
        .resolves(nodesData)
      proxyquire(
        "../../src/setUp/containers/params",
        { getNodes: { getNodes: global.getMockNodes } }
      )
    })

    afterEach(() => {
      global.getMockNodes.restore()
    })

    it("sends expected props to params", () => {
      const nodeFields = [
        { name: "id", type: "text" },
        { name: "name", type: "text" },
        { name: "type", type: "text" }
      ]
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "nodes" })
      expect(app.state("show")).to.equal("nodes")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).props().backend).to.equal(backend)
      expect(app.find(Params).props().title).to.equal("Nodes:")
      expect(JSON.stringify(app.find(Params).props().fields))
        .to.deep.equal(JSON.stringify(nodeFields))
      expect(app.find(Params).props().get).to.equal(getNodes)
      expect(app.find(Params).props().set).to.equal(setNode)
      expect(app.find(Params).props().paramName).to.equal("node")
      expect(app.find(Params).props().createText).to.equal("Add Node")
      sinon.assert.calledOnce(global.getMockNodes)
    })
  })
})
