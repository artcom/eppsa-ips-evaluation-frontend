import React from "react"
import { describe, it } from "mocha"
import { shallow, mount } from "enzyme"
import sinon from "sinon"
import { backend } from "../../src/constants"
import {
  callSubmitFunctions,
  hasInputs,
  hasSubmit,
  isAForm,
  storeInput
} from "../helpers/formHelpers"
import Form from "../../src/setUp/components/form"


describe("Form component", () => {
  it("is a form", () => {
    const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
    isAForm(shallow(<Form fields={ fields } />))
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      hasSubmit(shallow(<Form fields={ fields } />), "Create")
    })

    it("the expected Input components", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      hasInputs(mount(<Form fields={ fields } />), [
        { name: "field1", type: "text" },
        { name: "field2", type: "text" }
      ])
    })
  })

  describe("does", () => {
    it("store node data in state when changed in input field", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      storeInput(mount(<Form fields={ fields } />), [
        { name: "field1", value: "value1" },
        { name: "field2", value: "value2" }
      ])
    })

    it("call setNode and onSubmitted with the expected data when form is submitted",
      done => {
        const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
        const onSubmittedSpy = sinon.spy()
        const setSpy = sinon.spy()
        const nodeForm = mount(
          <Form
            fields={ fields }
            set={ setSpy }
            paramName={ "param" }
            onSubmitted={ onSubmittedSpy } />
        )
        const input = { field1: "value1", field2: "value2" }
        const callArgs = { backend, param: { field1: "value1", field2: "value2" } }
        callSubmitFunctions(nodeForm, input, callArgs, setSpy, onSubmittedSpy, done)
      })
  })
})
