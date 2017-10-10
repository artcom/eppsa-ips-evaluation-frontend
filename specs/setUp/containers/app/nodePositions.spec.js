/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../../src/setUp/containers/app"
import config from "../../../../src/constants"
import DataTable from "../../../../src/setUp/components/dataTable"
import experimentsData from "../../../testData/experiments.json"
import Params from "../../../../src/setUp/containers/params"
import nodesData from "../../../testData/nodes.json"
import nodePositionsData from "../../../testData/nodePositionsFrontend.json"
import pointsData from "../../../testData/pointsFrontend.json"
import SelectCategory from "../../../../src/shared/components/selectCategory"
import Tab from "../../../../src/shared/components/tab"
import zoneSets from "../../../testData/zoneSets.json"
import { addParam } from "../../../helpers/appHelpers"
import { findButtonByName } from "../../../helpers/findElements"
import {
  getNodePositions,
  setNodePosition
} from "../../../../src/setUp/actions/nodePositionsActions"
import { checkProps } from "../../../helpers/propsHelpers"
const experimentsActions = require("../../../../src/shared/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const nodePositionsActions = require("../../../../src/setUp/actions/nodePositionsActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")
const zoneSetsActions = require("../../../../src/setUp/actions/zoneSetsActions")


describe("App NodePositions", () => {
  const backend = config.backend
  let getExperimentsStub
  let getNodesStub
  let getPointsStub
  let getNodePositionsStub
  let getZoneSetsStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getExperiments: getExperimentsStub }
    )
    getZoneSetsStub = sinon.stub(zoneSetsActions, "getZoneSets").resolves(zoneSets)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getZoneSets: getZoneSetsStub }
    )
    getNodesStub = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodes: getNodesStub }
    )
    getPointsStub = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getPoints: getPointsStub }
    )
    getNodePositionsStub = sinon.stub(nodePositionsActions, "getNodePositions")
      .resolves(nodePositionsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodePositions: getNodePositionsStub }
    )
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getZoneSetsStub.restore()
    getNodesStub.restore()
    getPointsStub.restore()
    getNodePositionsStub.restore()
  })

  describe("contains", () => {
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
          expect(app.find(SelectCategory)).to.have.length(1)
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

  describe("when nodePositions tab is active", () => {
    let setNodePositionStub
    let deleteNodePositionStub

    beforeEach(() => {
      setNodePositionStub = sinon.stub(nodePositionsActions, "setNodePosition")
        .resolves({
          nodeName: "Node3",
          pointName: "point3",
          experimentName: "fake-experiment1"
        })
      proxyquire(
        "../../../../src/setUp/containers/app",
        { setNodePosition: setNodePositionStub }
      )
      deleteNodePositionStub = sinon.stub(nodePositionsActions, "deleteNodePosition")
        .resolves("Node1")
      proxyquire(
        "../../../../src/setUp/containers/app",
        { deleteNodePosition: deleteNodePositionStub }
      )
    })

    afterEach(() => {
      getNodePositionsStub.restore()
      setNodePositionStub.restore()
      deleteNodePositionStub.restore()
    })

    it("sends expected props to params", done => {
      const nodePositionsFields = [
        { name: "nodeName", type: "select", options: ["Node1", "Node2"] },
        { name: "pointName", type: "select", options: ["point1", "point2"] },
        { name: "experimentName", type: "text", value: "fake-experiment1", readOnly: true }
      ]
      const props = {
        backend,
        title: "Node Positions for \"fake-experiment1\":",
        get: getNodePositions,
        set: setNodePosition,
        paramName: "nodePosition",
        createText: "Set Node Position in \"fake-experiment1\"",
        experimentName: "fake-experiment1"
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

    it("sends expected props to selectCategory", done => {
      const props = { categories: experimentsData, title: "Select Experiment:" }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectCategory)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("get nodePositions function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        setImmediate(() => {
          sinon.assert.calledOnce(getNodePositionsStub)
          sinon.assert.calledWith(
            getNodePositionsStub,
            { backend, experimentName: "fake-experiment1" }
          )
          done()
        })
      })
    })

    it("get nodes, get experiments and get points is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        sinon.assert.calledTwice(getExperimentsStub)
        sinon.assert.calledOnce(getPointsStub)
        sinon.assert.calledOnce(getNodesStub)
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "NodePositions")
        nodesTab.simulate("click")
        setImmediate(() => {
          expect(app.state("show")).to.equal("nodePositions")
          sinon.assert.calledThrice(getExperimentsStub)
          sinon.assert.calledTwice(getPointsStub)
          sinon.assert.calledTwice(getNodesStub)
          done()
        })
      })
    })

    it("when an experiment is selected the selected experiment is set in state", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectCategory)
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
        sinon.assert.calledOnce(getNodePositionsStub)
        const data = {
          nodeName: "Node2",
          pointName: "point2",
          experimentName: "fake-experiment1"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "nodePosition",
            experimentName: "fake-experiment1",
            createText: "Set Node Position in \"fake-experiment1\"",
            data
          })
          setImmediate(() => {
            sinon.assert.calledOnce(setNodePositionStub)
            sinon.assert.calledWith(
              setNodePositionStub,
              { backend, experimentName: "fake-experiment1", nodePosition: data }
            )
            done()
          })
        })
      })
    })

    it("when a node position is added get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledOnce(getNodePositionsStub)
        const data = {
          nodeName: "Node2",
          pointName: "point2",
          experimentName: "fake-experiment1"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "nodePosition",
            experimentName: "fake-experiment1",
            createText: "Set Node Position in \"fake-experiment1\"",
            data
          })
          setImmediate(() => {
            sinon.assert.calledTwice(getNodePositionsStub)
            sinon.assert.calledWith(
              getNodePositionsStub,
              { backend, experimentName: "fake-experiment1" }
            )
            done()
          })
        })
      })
    })

    it("when a node position is deleted, delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        experimentName: "fake-experiment1",
        nodePosition: {
          nodeName: "Node1",
          pointName: "point1",
          experimentName: "fake-experiment1"
        }
      }
      app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
      setImmediate(() => {
        const dataTable = app.find(Params)
          .filterWhere(params => params.props().paramName === "nodePosition")
          .find(DataTable)
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        setImmediate(() => {
          sinon.assert.calledOnce(deleteNodePositionStub)
          sinon.assert.calledWith(deleteNodePositionStub, callArgs)
          done()
        })
      })
    })

    it("when a node position is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        experimentName: "fake-experiment1"
      }
      app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
      setImmediate(() => {
        const dataTable = app.find(Params)
          .filterWhere(params => params.props().paramName === "nodePosition")
          .find(DataTable)
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        setImmediate(() => {
          sinon.assert.calledTwice(getNodePositionsStub)
          sinon.assert.callOrder(
            getNodePositionsStub.withArgs(callArgs),
            getNodePositionsStub.withArgs(callArgs)
          )
          done()
        })
      })
    })
  })
})
