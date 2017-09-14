/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import { keys } from "lodash"
import App from "../../src/setUp/containers/app"
import { backend } from "../../src/constants"
import experimentsData from "../testData/experiments.json"
import { findButtonByName } from "../helpers/findElements"
import Form from "../../src/setUp/components/form"
import inputData from "../helpers/inputData"
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
      global.setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../src/setUp/containers/params",
        { setExperiment: { setExperiment: global.setMockExperiment } }
      )
    })

    afterEach(() => {
      global.getMockExperiments.restore()
      global.setMockExperiment.restore()
    })

    it("sends expected props to params", () => {
      const experimentFields = [{ name: "name", type: "text" }]
      const props = {
        backend,
        title: "Experiments:",
        get: getExperiments,
        set: setExperiment,
        delete: deleteExperiment,
        paramName: "experiment",
        createText: "Create Experiment"
      }
      const copyProps = {
        fields: experimentFields
      }

      const app = mount(<App backend={ backend } />)
      app.setState({ show: "experiments" })
      const params = app.find(Params)

      expect(app.state("show")).to.equal("experiments")
      expect(params).to.have.length(1)
      checkProps({ mountedComponent: params, props })
      checkProps({ mountedComponent: params, props: copyProps, copy: true })
    })

    it("get function is called", () => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "experiments" })
      sinon.assert.calledOnce(global.getMockExperiments)
    })

    it("when an experiment  is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "experiments" })
      sinon.assert.calledOnce(global.getMockExperiments)
      setImmediate(() => {
        const data = {
          name: "fake-experiment3"
        }
        addParam({
          mountedComponent: app,
          paramName: "experiment",
          createText: "Create Experiment",
          data
        })
        setImmediate(() => {
          sinon.assert.calledOnce(global.setMockExperiment)
          sinon.assert.calledWith(global.setMockExperiment, { backend, experiment: data })
          done()
        })
      })
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
      global.setMockPoint = sinon.stub(pointsActions, "setPoint")
        .resolves({
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        })
      proxyquire(
        "../../src/setUp/containers/params",
        { setPoint: { setPoint: global.setMockPoint } }
      )
    })

    afterEach(() => {
      global.getMockPoints.restore()
      global.setMockPoint.restore()
    })

    it("expected props are sent to params", () => {
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
      app.setState({ show: "points" })
      const params = app.find(Params)

      expect(app.state("show")).to.equal("points")
      expect(params).to.have.length(1)
      checkProps({ mountedComponent: params, props })
      checkProps({ mountedComponent: params, props: copyProps, copy: true })
    })

    it("get function is called", () => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "points" })
      sinon.assert.calledOnce(global.getMockPoints)
    })

    it("when a point is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "points" })
      sinon.assert.calledOnce(global.getMockPoints)
      setImmediate(() => {
        const data = {
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        }
        addParam({ mountedComponent: app, paramName: "point", createText: "Add Point", data })
        setImmediate(() => {
          sinon.assert.calledOnce(global.setMockPoint)
          sinon.assert.calledWith(global.setMockPoint, { backend, point: data })
          done()
        })
      })
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
      global.setMockNode = sinon.stub(nodesActions, "setNode")
        .resolves({
          id: "node3",
          name: "Node3",
          type: "quuppa"
        })
      proxyquire(
        "../../src/setUp/containers/params",
        { setNode: { setNode: global.setMockNode } }
      )
    })

    afterEach(() => {
      global.getMockNodes.restore()
      global.setMockNode.restore()
    })

    it("sends expected props to params", () => {
      const nodeFields = [
        { name: "id", type: "text" },
        { name: "name", type: "text" },
        { name: "type", type: "text" }
      ]
      const props = {
        backend,
        title: "Nodes:",
        get: getNodes,
        set: setNode,
        paramName: "node",
        createText: "Add Node"
      }
      const copyProps = { fields: nodeFields }

      const app = mount(<App backend={ backend } />)
      app.setState({ show: "nodes" })
      const params = app.find(Params)

      expect(app.state("show")).to.equal("nodes")
      expect(params).to.have.length(1)
      checkProps({ mountedComponent: params, props })
      checkProps({ mountedComponent: params, props: copyProps, copy: true })
    })

    it("get function is called", () => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "nodes" })
      sinon.assert.calledOnce(global.getMockNodes)
    })

    it("when a node is added set function is called with the expected arguments", done => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "nodes" })
      sinon.assert.calledOnce(global.getMockNodes)
      setImmediate(() => {
        const data = {
          id: "node3",
          name: "Node3",
          type: "quuppa"
        }
        addParam({ mountedComponent: app, paramName: "node", createText: "Add Node", data })
        setImmediate(() => {
          sinon.assert.calledOnce(global.setMockNode)
          sinon.assert.calledWith(global.setMockNode, { backend, node: data })
          done()
        })
      })
    })
  })
})

function checkProps({ mountedComponent, props, copy = false }) {
  for (const key of keys(props)) {
    if (copy) {
      expect(JSON.stringify(mountedComponent.props()[key])).to.equal(JSON.stringify(props[key]))
    } else {
      expect(mountedComponent.props()[key]).to.equal(props[key])
    }
  }
}

function addParam({ mountedComponent, paramName, createText, data }) {
  const specificParams = mountedComponent
    .find(Params)
    .filterWhere(params => params.props().paramName === paramName)
  findButtonByName(specificParams, createText).simulate("click")
  const form = specificParams.find(Form)
  inputData(form, data)
  form.simulate("submit")
}
