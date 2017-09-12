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
import inputData from "../helpers/inputData"
import Nodes from "../../src/setUp/containers/nodes"
import NodeForm from "../../src/setUp/components/nodeForm"
import nodesData from "../testData/nodes.json"
import Title from "../../src/setUp/components/title"
const nodesActions = require("../../src/setUp/actions/nodesActions")


describe("Nodes", () => {
  describe("contains", () => {
    it("a title", () => {
      const nodes = shallow(<Nodes />)
      expect(nodes.find(Title)).to.have.length(1)
      expect(nodes.find(Title).childAt(0).text()).to.equal("Nodes:")
    })

    it("a table with the expected headers", () => {
      const headers = ["id", "name", "type"]
      const nodes = mount(<Nodes />)
      expect(nodes.find(DataTable)).to.have.length(1)
      const tableHeaders = nodes
        .find(DataTable).at(0)
        .find("tr").at(0)
        .find("th").map(header => header.text())
      expect(tableHeaders).to.deep.equal(headers)
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

    it("calls componentDidMount and getNodes", () => {
      const componentDidMount = sinon.spy(Nodes.prototype, "componentDidMount")
      mount(<Nodes backend={ backend } />)
      expect(Nodes.prototype.componentDidMount.calledOnce).to.equal(true)
      sinon.assert.calledOnce(global.getMockNodes)
      sinon.assert.calledWith(global.getMockNodes, { backend })
      componentDidMount.restore()
    })

    it("stores nodes retrieved from the backend in state", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      expect(nodes.state("nodes")).to.deep.equal([])
      sinon.assert.calledOnce(global.getMockNodes)
      sinon.assert.calledWith(global.getMockNodes, { backend })
      setImmediate(() => {
        const storedNodes = JSON.stringify(nodes.state("nodes"))
        const expectedNodes = JSON.stringify(nodesData)
        expect(storedNodes).to.equal(expectedNodes)
        done()
      })
    })

    it("renders nodes that are present in state", () => {
      const nodes = mount(<Nodes backend={ backend } />)
      expect(nodes.props().backend).to.equal(backend)
      nodes.setState({ nodes: nodesData })
      const displayedNodes = nodes
        .find(DataTable).at(0)
        .find("tr")
        .map(row => row.find("td").map(data => data.text()))
      expect(slice(displayedNodes, 1)).to.deep.equal(nodesData.map(node => [
        node.id,
        node.name,
        node.type,
        "Delete"
      ]))
    })

    it("sets loaded state to true when nodes have been retrieved from the backend", done => {
      const points = mount(<Nodes backend={ backend } />)
      expect(points.state("loaded")).to.equal(false)
      setImmediate(() => {
        expect(points.state("loaded")).to.equal(true)
        done()
      })
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
      expect(nodes.state("showNodeForm")).to.equal(false)
      setImmediate(() => {
        const createNodeButton = nodes
          .find(Button)
          .filterWhere(button => button.text() === "Add Node")
        createNodeButton.simulate("click")
        expect(nodes.state("showNodeForm")).to.equal(true)
        done()
      })
    })

    it("displays a node form when add node button is pushed", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      setImmediate(() => {
        expect(nodes.find(NodeForm)).to.have.length(0)
        const createNodeButton = nodes
          .find(Button)
          .filterWhere(button => button.text() === "Add Node")
        createNodeButton.simulate("click")
        expect(nodes.find(NodeForm)).to.have.length(1)
        done()
      })
    })

    it("submits new node to backend when filled form is submitted", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      setImmediate(() => {
        expect(nodes.find(NodeForm)).to.have.length(0)
        const createNodeButton = nodes
          .find(Button)
          .filterWhere(button => button.text() === "Add Node")
        createNodeButton.simulate("click")
        const nodeForm = nodes.find(NodeForm)
        expect(nodeForm).to.have.length(1)
        inputData(nodeForm, {
          id: "node1",
          name: "Node1",
          type: "quuppa"
        })
        nodes.find(NodeForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockNode)
        sinon.assert.calledWith(
          global.setMockNode,
          {
            backend,
            node: {
              id: "node1",
              name: "Node1",
              type: "quuppa"
            }
          }
        )
        done()
      })
    })

    it("hides node form when onSubmitted is called", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      setImmediate(() => {
        expect(nodes.find(NodeForm)).to.have.length(0)
        const createNodeButton = nodes
          .find(Button)
          .filterWhere(button => button.text() === "Add Node")
        createNodeButton.simulate("click")
        const nodeForm = nodes.find(NodeForm)
        expect(nodeForm).to.have.length(1)
        inputData(nodeForm, {
          id: "node1",
          name: "Node1",
          type: "quuppa"
        })
        nodes.find(NodeForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockNode)
        setImmediate(() => {
          expect(nodes.state("showNodeForm")).to.equal(false)
          expect(nodes.find(NodeForm)).to.have.length(0)
          done()
        })
      })
    })

    it("reloads nodes when onSubmitted is called", done => {
      const nodes = mount(<Nodes backend={ backend } />)
      setImmediate(() => {
        expect(nodes.find(NodeForm)).to.have.length(0)
        const createNodeButton = nodes
          .find(Button)
          .filterWhere(button => button.text() === "Add Node")
        createNodeButton.simulate("click")
        const nodeForm = nodes.find(NodeForm)
        expect(nodeForm).to.have.length(1)
        inputData(nodeForm, {
          id: "node3",
          name: "Node3",
          type: "quuppa"
        })
        global.getMockNodes.restore()
        global.getMockNodes = sinon.stub(nodesActions, "getNodes")
          .resolves(concat(
            nodesData,
            {
              id: "node3",
              name: "Node3",
              type: "quuppa"
            }
          ))
        proxyquire(
          "../../src/setUp/containers/nodes",
          { getNodes: { getNodes: global.getMockNodes } }
        )
        nodes.find(NodeForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockNode)
        setImmediate(() => {
          sinon.assert.calledOnce(global.getMockNodes)
          const storedNodes = JSON.stringify(nodes.state("nodes"))
          const expectedNodes = JSON.stringify(concat(
            nodesData,
            {
              id: "node3",
              name: "Node3",
              type: "quuppa"
            }
          ))
          expect(storedNodes).to.equal(expectedNodes)
          done()
        })
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
      expect(nodes.props().backend).to.equal(backend)
      setImmediate(() => {
        expect(nodes.find("tbody").find("tr"))
          .to.have.length(2)
        const point1DeleteButton = nodes.find("tbody").find("tr").at(0)
          .find(Button)
          .filterWhere(button => button.text() === "Delete")
        point1DeleteButton.simulate("click")
        sinon.assert.calledOnce(global.deleteMockNode)
        sinon.assert.calledWith(
          global.deleteMockNode,
          { backend, name: "Node1" }
        )
        done()
      })
    })
  })
})
