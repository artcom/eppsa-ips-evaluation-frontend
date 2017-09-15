/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../src/setUp/containers/app"
import { backend } from "../../src/constants"
import DataTable from "../../src/setUp/components/dataTable"
import experimentsData from "../testData/experiments.json"
import { findButtonByName } from "../helpers/findElements"
import Form from "../../src/setUp/components/form"
import inputData from "../helpers/inputData"
import Params from "../../src/setUp/containers/params"
import nodesData from "../testData/nodes.json"
import nodePositionsData from "../testData/nodePositions.json"
import pointsData from "../testData/points.json"
import SelectExperiment from "../../src/setUp/components/selectExperiment"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"
import {
  deleteExperiment,
  getExperiments,
  setExperiment
} from "../../src/setUp/actions/experimentsActions"
import { getNodes, setNode } from "../../src/setUp/actions/nodesActions"
import { getNodePositions, setNodePosition } from "../../src/setUp/actions/nodePositionsActions"
import { getPoints, setPoint } from "../../src/setUp/actions/pointsActions"
import { checkProps } from "../helpers/propsHelpers"
const experimentsActions = require("../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../src/setUp/actions/nodesActions")
const nodePositionsActions = require("../../src/setUp/actions/nodePositionsActions")
const pointsActions = require("../../src/setUp/actions/pointsActions")


describe("App", () => {
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    let getMockNodePositions

    beforeEach(() => {
      getMockNodePositions = sinon.stub(nodePositionsActions, "getNodePositions")
        .resolves(nodePositionsData)
      proxyquire(
        "../../src/setUp/containers/app",
        { getNodePositions: { getNodePositions: getMockNodePositions } }
      )
    })

    afterEach(() => {
      getMockNodePositions.restore()
    })
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

    it("node positions when show state is \"nodePositions\" and an experiment is selected",
      done => {
        const app = mount(<App />)
        app.setState({
          show: "nodePositions",
          loaded: true,
          selectedExperiment: "fake-experiment",
          experiments: [{ name: "fake-experiment" }]
        })
        setImmediate(() => {
          sinon.assert.calledTwice(getMockExperiments)
          expect(app.find(Params)).to.have.length(1)
          expect(
            app
              .find(Params)
              .filterWhere(params => params.props().paramName === "nodePosition")
          ).to.have.length(1)
          expect(findButtonByName(app, "Select Other Experiment")).to.have.length(1)
          done()
        })
      }
    )

    it("no node positions when show state is \"nodePositions\" but no experiment is selected",
      () => {
        const app = shallow(<App />)
        app.setState({ show: "nodePositions", loaded: true, selectedExperiment: false })
        expect(app.find(Params).filterWhere(params => params.props().paramName === "nodePosition"))
          .to.have.length(0)
      }
    )

    it("an experiment selection component when show state is \"nodePositions\" but no experiment" +
      " is selected",
      done => {
        const app = shallow(<App />)
        setImmediate(() => {
          app.setState({ show: "nodePositions", loaded: true, selectedExperiment: false })
          expect(app.find(SelectExperiment)).to.have.length(1)
          done()
        })
      }
    )

    it("no node positions when show state is not \"nodePositions\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other", loaded: true })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "nodePosition"))
        .to.have.length(0)
    })
  })

  describe("loads", () => {
    it("experiments into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledTwice(getMockExperiments)
      setImmediate(() => {
        expect(app.state("experiments")).to.deep.equal(experimentsData)
        done()
      })
    })

    it("nodes into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getMockNodes)
      setImmediate(() => {
        expect(app.state("nodes")).to.deep.equal(nodesData)
        done()
      })
    })

    it("points into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getMockPoints)
      setImmediate(() => {
        expect(app.state("points")).to.deep.equal(pointsData)
        done()
      })
    })
  })

  describe("activates", () => {
    let setMockExperiment

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
    })

    afterEach(() => {
      setMockExperiment.restore()
    })

    it("Points when points tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "Points")
        pointsTab.simulate("click")
        expect(pointsTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("points")
        done()
      })
    })

    it("Nodes when nodes tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "Nodes")
        nodesTab.simulate("click")
        expect(nodesTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("nodes")
        done()
      })
    })

    it("NodePositions when nodePositions tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "NodePositions")
        nodesTab.simulate("click")
        expect(nodesTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("nodePositions")
        done()
      })
    })
  })

  describe("when experiments tab is active", () => {
    let setMockExperiment
    let deleteMockExperiment

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
      deleteMockExperiment = sinon.stub(experimentsActions, "deleteExperiment")
        .resolves("fake-experiment1")
      proxyquire("../../src/setUp/containers/app", { deleteExperiment: deleteMockExperiment })
    })

    afterEach(() => {
      setMockExperiment.restore()
      deleteMockExperiment.restore()
    })

    it("sends expected props to params", done => {
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
      setImmediate(() => {
        app.setState({ show: "experiments" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("experiments")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        sinon.assert.calledTwice(getMockExperiments)
        sinon.assert.calledWith(getMockExperiments, { backend })
        done()
      })
    })

    it("when an experiment is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        sinon.assert.calledTwice(getMockExperiments)
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
          sinon.assert.calledOnce(setMockExperiment)
          sinon.assert.calledWith(setMockExperiment, { backend, experiment: data })
          done()
        })
      })
    })

    it("when an experiment is deleted delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend, experiment: { name: "fake-experiment1" } }
      const dataTable = app
      app.setState({ show: "experiments" })
        .find(Params)
        .filterWhere(params => params.props().paramName === "experiment")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteMockExperiment)
        sinon.assert.calledWith(deleteMockExperiment, callArgs)
        done()
      })
    })
  })

  describe("when points tab is active", () => {
    let setMockExperiment
    let setMockPoint

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
      setMockPoint = sinon.stub(pointsActions, "setPoint")
        .resolves({
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setPoint: setMockPoint }
      )
    })

    afterEach(() => {
      setMockExperiment.restore()
      setMockPoint.restore()
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
  })

  describe("when nodes tab is active", () => {
    let setMockExperiment
    let setMockNode

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
      setMockNode = sinon.stub(nodesActions, "setNode")
        .resolves({
          id: "node3",
          name: "Node3",
          type: "quuppa"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setNode: setMockNode }
      )
    })

    afterEach(() => {
      setMockExperiment.restore()
      setMockNode.restore()
    })

    it("sends expected props to params", done => {
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
      setImmediate(() => {
        app.setState({ show: "nodes" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("nodes")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodes" })
        sinon.assert.calledTwice(getMockNodes)
        sinon.assert.calledWith(getMockNodes, { backend })
        done()
      })
    })

    it("when a node is added set function is called with the expected arguments", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodes" })
        sinon.assert.calledTwice(getMockNodes)
        const data = {
          id: "node3",
          name: "Node3",
          type: "quuppa"
        }
        setImmediate(() => {
          addParam({ mountedComponent: app, paramName: "node", createText: "Add Node", data })
          sinon.assert.calledOnce(setMockNode)
          sinon.assert.calledWith(setMockNode, { backend, node: data })
          done()
        })
      })
    })
  })

  describe("when nodePositions tab is active", () => {
    let getMockNodePositions
    let setMockNodePosition

    beforeEach(() => {
      getMockNodePositions = sinon.stub(nodePositionsActions, "getNodePositions")
        .resolves(nodePositionsData)
      proxyquire(
        "../../src/setUp/containers/app",
        { getNodePositions: { getNodePositions: getMockNodePositions } }
      )
      setMockNodePosition = sinon.stub(nodePositionsActions, "setNodePosition")
        .resolves({
          nodeName: "Node3",
          pointName: "point3",
          experimentName: "fake-experiment1"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setNodePosition: { setNodePosition: setMockNodePosition } }
      )
    })

    afterEach(() => {
      getMockNodePositions.restore()
      setMockNodePosition.restore()
    })

    it("sends expected props to params", done => {
      const nodePositionsFields = [
        { name: "nodeName", type: "select", options: ["Node1", "Node2"] },
        { name: "pointName", type: "select", options: ["point1", "point2"] },
        { name: "experimentName", type: "text" }
      ]
      const props = {
        backend,
        title: "Node Positions for \"fake-experiment1\":",
        get: getNodePositions,
        set: setNodePosition,
        paramName: "nodePosition",
        createText: "Set Node Position in \"fake-experiment1\"",
        experiment: "fake-experiment1"
      }
      const copyProps = { fields: nodePositionsFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("nodePositions")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("sends expected props to selectExperiment", done => {
      const props = { experiments: experimentsData }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectExperiment)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledTwice(getMockExperiments)
        sinon.assert.calledWith(getMockExperiments, { backend })
        setImmediate(() => {
          sinon.assert.calledOnce(getMockNodePositions)
          sinon.assert.calledWith(
            getMockNodePositions,
            { backend, experimentName: "fake-experiment1" }
          )
          done()
        })
      })
    })

    it("when an experiment is selected the selected experiment is set in state", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectExperiment)
        findButtonByName(selectExperiment, "fake-experiment1").simulate("click")
        expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
        done()
      })
    })

    it("sets selectedExperiment state to null when select other experiment button is pushed",
      done => {
        const app = mount(<App backend={ backend } />)
        setImmediate(() => {
          app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
          expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
          findButtonByName(app, "Select Other Experiment").simulate("click")
          expect(app.state("selectedExperiment")).to.equal(null)
          done()
        })
      }
    )

    it("when a node position is added set function is called with the expected arguments", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledOnce(getMockNodePositions)
        const data = {
          nodeName: "Node3",
          pointName: "point3",
          experimentName: "fake-experiment1"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "nodePosition",
            experiment: "fake-experiment1",
            createText: "Set Node Position in \"fake-experiment1\"",
            data
          })
          setImmediate(() => {
            sinon.assert.calledOnce(setMockNodePosition)
            sinon.assert.calledWith(
              setMockNodePosition,
              { backend, experimentName: "fake-experiment1", nodePosition: data }
            )
            done()
          })
        })
      })
    })
  })
})

function addParam({ mountedComponent, paramName, experiment, createText, data }) {
  const specificParams = experiment
    ? mountedComponent
        .find(Params)
        .filterWhere(params =>
          params.props().paramName === paramName
          && params.props().experiment === experiment
        )
    : mountedComponent
        .find(Params)
        .filterWhere(params => params.props().paramName === paramName)
  findButtonByName(specificParams, createText).simulate("click")
  const form = specificParams.find(Form)
  inputData(form, data)
  form.simulate("submit")
}
