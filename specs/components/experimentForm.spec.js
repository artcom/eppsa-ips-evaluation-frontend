/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import {
  callSubmitFunctions,
  hasInputs,
  hasSubmit,
  isAForm,
  storeInput
} from "../helpers/formHelpers"
const experimentActions = require("../../src/setUp/actions/experimentsActions")


describe("ExperimentForm component", () => {
  it("is a form", () => {
    isAForm(shallow(<ExperimentForm />))
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      hasSubmit(shallow(<ExperimentForm />), "Create")
    })

    it("the expected Input components", () => {
      hasInputs(mount(<ExperimentForm />), [
        { name: "name", type: "text" }
      ])
    })
  })

  describe("does", () => {
    beforeEach(() => {
      global.setMockExperiment = sinon.stub(experimentActions, "setExperiment")
        .resolves("new-experiment")
      proxyquire(
        "../../src/setUp/components/experimentForm",
        { setExperiment: { setExperiment: global.setMockExperiment } }
      )
    })

    afterEach(() => {
      global.setMockExperiment.restore()
    })

    it("store experiment name in state when changed in input field", () => {
      storeInput(mount(<ExperimentForm />), [
        { name: "name", value: "new-experiment" }
      ])
    })

    it("call setExperiment and onSubmitted with the expected name when form is submitted",
      done => {
        const onSubmitted = sinon.spy()
        const experimentForm = mount(<ExperimentForm onSubmitted={ onSubmitted } />)
        const input = { name: "new-experiment" }
        const callArgs = { backend, experimentName: "new-experiment" }
        callSubmitFunctions(
          experimentForm,
          input,
          callArgs,
          global.setMockExperiment,
          onSubmitted,
          done
        )
      })
  })
})
