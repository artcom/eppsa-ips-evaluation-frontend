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
import PointForm from "../../src/setUp/components/pointForm"
const pointActions = require("../../src/setUp/actions/pointsActions")


describe("PointForm component", () => {
  it("is a form", () => {
    isAForm(shallow(<PointForm />))
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      hasSubmit(shallow(<PointForm />), "Create")
    })

    it("the expected Input components", () => {
      hasInputs(mount(<PointForm />), [
        { name: "name", type: "text" },
        { name: "X", type: "text" },
        { name: "Y", type: "text" },
        { name: "Z", type: "text" }
      ])
    })
  })

  describe("does", () => {
    beforeEach(() => {
      global.setMockPoint = sinon.stub(pointActions, "setPoint")
        .resolves("point1")
      proxyquire(
        "../../src/setUp/components/pointForm",
        { setPoint: { setPoint: global.setMockPoint } }
      )
    })

    afterEach(() => {
      global.setMockPoint.restore()
    })

    it("store node data in state when changed in input field", () => {
      storeInput(mount(<PointForm />), [
        { name: "name", value: "point1" },
        { name: "X", value: 1 },
        { name: "Y", value: 1 },
        { name: "Z", value: 2 }
      ])
    })

    it("call setNode and onSubmitted with the expected data when form is submitted",
      done => {
        const onSubmitted = sinon.spy()
        const pointForm = mount(<PointForm onSubmitted={ onSubmitted } />)
        const input = { name: "point1", X: 1, Y: 1, Z: 2 }
        const callArgs = {
          backend,
          point: {
            name: "point1",
            trueCoordinateX: 1,
            trueCoordinateY: 1,
            trueCoordinateZ: 2
          }
        }
        callSubmitFunctions(pointForm, input, callArgs, global.setMockPoint, onSubmitted, done)
      })
  })
})
