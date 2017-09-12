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
import Nodes from "../../src/setUp/containers/nodes"
import NodeForm from "../../src/setUp/components/nodeForm"
import nodesData from "../testData/nodes.json"
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
const nodesActions = require("../../src/setUp/actions/nodesActions")


describe("Nodes", () => {
  describe("contains", () => {
    it("a title", () => {
      hasTitle(shallow(<Nodes />), "Nodes:")
    })

    it("a table with the expected headers", () => {
      const headers = ["id", "name", "type"]
      const nodes = mount(<Nodes />)
      hasTable(nodes, headers)
    })

    it("no create node button when loaded state is false", () => {
      const nodes = shallow(<Nodes />)
      expect(nodes.state("loaded")).to.equal(false)
      expect(nodes.find(Button)).to.have.length(0)
    })

    it("a create node button when loaded state is true", () => {
      const nodes = shallow(<Nodes />)
      nodes.setState({ loaded: true })
      expect(nodes.find(Button)).to.have.length(1)
      expect(nodes.find(Button).childAt(0).text()).to.equal("Add Node")
    })
  })

  describe("for retrieval", () => {
    beforeEach(() => {
      global.getMockNodes = sinon.stub(nodesActions, "getNodes")
        .resolves(nodesData)
      proxyquire(
        "../../src/setUp/containers/nodes",
        { getNodes: { getNodes: global.getMockNodes } }
      )
    })

    afterEach(() => {
      global.getMockNodes.restore()
    })

    it("calls componentDidMount and getNodes and passes the expected props to Nodes", () => {
      callsMountFunctions(Nodes, { backend }, global.getMockNodes, { backend })
    })

    it("stores nodes retrieved from the backend in state", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      storeDataInState(nodes, global.getMockNodes, "nodes", nodesData, done)
    })

    it("renders nodes that are present in state", () => {
      const nodes = mount(<Nodes backend={ backend } />)
      const expectedRows = nodesData.map(node => [
        node.id,
        node.name,
        node.type,
        "Delete"
      ])
      displayInTable(nodes, { nodes: nodesData }, expectedRows)
    })

    it("sets loaded state to true when nodes have been retrieved from the backend", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      acknowledgeRetrieval(nodes, global.getMockNodes, done)
    })
  })

  describe("for creation", () => {
    beforeEach(() => {
      global.getMockNodes = sinon.stub(nodesActions, "getNodes")
        .resolves(nodesData)
      proxyquire(
        "../../src/setUp/containers/nodes",
        { getNodes: { getNodes: global.getMockNodes } }
      )
      global.setMockNode = sinon.stub(nodesActions, "setNode")
        .resolves("Node1")
      proxyquire(
        "../../src/setUp/components/nodeForm",
        { setNode: { setNode: global.setMockNode } }
      )
    })

    afterEach(() => {
      global.getMockNodes.restore()
      global.setMockNode.restore()
    })

    it("sets showNodeForm state to true when add node button is pushed", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      activateOnSelect(nodes, "showNodeForm", "Add Node", done)
    })

    it("displays a node form when add node button is pushed", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      showForm(nodes, NodeForm, "Add Node", done)
    })

    it("submits new node to backend when filled form is submitted", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      const submitNode = {
        id: "node1",
        name: "Node1",
        type: "quuppa"
      }
      const callArgs = {
        backend,
        node: {
          id: "node1",
          name: "Node1",
          type: "quuppa"
        }
      }
      submitData(nodes, NodeForm, "Add Node", submitNode, global.setMockNode, callArgs, done)
    })

    it("hides node form when onSubmitted is called", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      const submitNode = {
        id: "node1",
        name: "Node1",
        type: "quuppa"
      }
      hideForm(
        nodes,
        NodeForm,
        submitNode,
        "showNodeForm",
        "Add Node",
        global.setMockNode,
        done
      )
    })

    it("reloads nodes when onSubmitted is called", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      const submitNode = {
        id: "node3",
        name: "Node3",
        type: "quuppa"
      }
      setImmediate(() => {
        activateForm(nodes, NodeForm, "Add Node", submitNode)
        global.getMockNodes.restore()
        const newData = concat(
          nodesData,
          {
            id: "node3",
            name: "Node3",
            type: "quuppa"
          }
        )
        global.getMockNodes = sinon.stub(nodesActions, "getNodes")
          .resolves(newData)
        proxyquire(
          "../../src/setUp/containers/nodes",
          { getNodes: { getNodes: global.getMockNodes } }
        )
        reloadData(
          nodes,
          NodeForm,
          "nodes",
          global.setMockNode,
          global.getMockNodes,
          newData,
          done
        )
      })
    })
  })

  describe("for deletion", () => {
    beforeEach(() => {
      global.getMockNodes = sinon.stub(nodesActions, "getNodes")
        .resolves(nodesData)
      proxyquire(
        "../../src/setUp/containers/nodes",
        { getNodes: { getNodes: global.getMockNodes } }
      )
      global.deleteMockNode = sinon.stub(nodesActions, "deleteNode")
        .resolves("Node1")
      proxyquire(
        "../../src/setUp/containers/nodes",
        { deleteNode: { deleteNode: global.deleteMockNode } }
      )
    })

    afterEach(() => {
      global.getMockNodes.restore()
      global.deleteMockNode.restore()
    })

    it("calls deleteNode when delete button is pushed", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      const deleteArgs = { backend, name: "Node1" }
      callDeleteData(nodes, global.deleteMockNode, deleteArgs, done)
    })
  })
})
