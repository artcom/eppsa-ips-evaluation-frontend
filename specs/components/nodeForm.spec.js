/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { shallow, mount } from "enzyme"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import {
  callSubmitFunctions,
  hasInputs,
  hasSubmit,
  isAForm,
  storeInput
} from "../helpers/formHelpers"
import NodeForm from "../../src/setUp/components/nodeForm"
const nodesActions = require("../../src/setUp/actions/nodesActions")


describe("NodeForm component", () => {
  it("is a form", () => {
    isAForm(shallow(<NodeForm />))
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      hasSubmit(shallow(<NodeForm />), "Create")
    })

    it("the expected Input components", () => {
      hasInputs(mount(<NodeForm />), [
        { name: "id", type: "text" },
        { name: "name", type: "text" },
        { name: "type", type: "text" }
      ])
    })
  })

  describe("does", () => {
    beforeEach(() => {
      global.setMockNode = sinon.stub(nodesActions, "setNode")
        .resolves("Node1")
      proxyquire(
        "../../src/setUp/components/pointForm",
        { setNode: { setNode: global.setMockNode } }
      )
    })

    afterEach(() => {
      global.setMockNode.restore()
    })

    it("store node data in state when changed in input field", () => {
      storeInput(mount(<NodeForm />), [
        { name: "id", value: "node1" },
        { name: "name", value: "Node1" },
        { name: "type", value: "quuppa" }
      ])
    })

    it("call setNode and onSubmitted with the expected data when form is submitted",
      done => {
        const onSubmitted = sinon.spy()
        const nodeForm = mount(<NodeForm onSubmitted={ onSubmitted } />)
        const input = { id: "node1", name: "Node1", type: "quuppa" }
        const callArgs = { backend, node: { id: "node1", name: "Node1", type: "quuppa" } }
        callSubmitFunctions(nodeForm, input, callArgs, global.setMockNode, onSubmitted, done)
      })
  })
})
