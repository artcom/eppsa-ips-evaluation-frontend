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
import pointsData from "../../../testData/pointsFrontend.json"
import { addParam } from "../../helpers/appHelpers"
import { findButtonByName } from "../../helpers/findElements"
import { getNodes, setNode } from "../../../../src/setUp/actions/nodesActions"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")


describe("App Nodes", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
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

  describe("when nodes tab is active", () => {
    let setMockNode
    let deleteMockNode

    beforeEach(() => {
      setMockNode = sinon.stub(nodesActions, "setNode")
        .resolves({
          id: "node3",
          name: "Node3",
          type: "quuppa"
        })
      proxyquire("../../../../src/setUp/containers/app", { setNode: setMockNode })
      deleteMockNode = sinon.stub(nodesActions, "deleteNode").resolves("node1")
      proxyquire("../../../../src/setUp/containers/app", { deleteNode: deleteMockNode })
    })

    afterEach(() => {
      setMockNode.restore()
      deleteMockNode.restore()
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

    it("when a node is deleted, delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        node: {
          name: "Node1",
          id: "node1",
          type: "quuppa"
        }
      }
      app.setState({ show: "nodes" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "node")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteMockNode)
        sinon.assert.calledWith(deleteMockNode, callArgs)
        done()
      })
    })

    it("when a node is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend }
      app.setState({ show: "nodes" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "node")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledTwice(getMockNodes)
        sinon.assert.alwaysCalledWith(getMockNodes, callArgs)
        done()
      })
    })
  })
})
