import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
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
import { findInputField } from "../helpers/findElements"
import Form, { setInitialValues } from "../../src/setUp/components/form"
import { StyledSelect } from "../../src/setUp/components/select"


describe("Form component", () => {
  it("is a form", () => {
    const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
    isAForm(shallow(<Form fields={ fields } />))
  })

  describe("contains", () => {
    it("a submit input", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      hasSubmit(shallow(<Form fields={ fields } submitName="Submit" />), "Submit")
    })

    it("the expected Input components", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      hasInputs(mount(<Form fields={ fields } />), fields)
    })

    it("a select element when type is \"select\"", () => {
      const fields = [{ name: "field1", type: "select", options: ["option1", "option2"] }]
      hasInputs(mount(<Form fields={ fields } />), fields)
    })
  })

  describe("setInitialvalues", () => {
    it("returns expected values", () => {
      const fields = [
        { name: "field1", type: "text" },
        { name: "field2", type: "select", options: ["option1", "option2"] },
        { name: "field3", type: "text", value: "value3" }
      ]
      const expectedValues = { field1: "", field2: "option1", field3: "value3" }
      expect(JSON.stringify(setInitialValues(fields))).to.equal(JSON.stringify(expectedValues))
    })
  })

  describe("does", () => {
    it("store param data in state when changed in input field", () => {
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      storeInput(mount(<Form fields={ fields } />), [
        { name: "field1", value: "value1" },
        { name: "field2", value: "value2" }
      ])
    })

    it("store param data in state when changed in select field", () => {
      const fields = [{ name: "field1", type: "select", options: ["option1", "option2"] }]
      const form = mount(<Form fields={ fields } />)
      form.find(StyledSelect).simulate("change", { target: { value: "option2" } })
      expect(form.state("field1")).to.equal("option2")
    })

    it("store param data in state when changed in checkbox field", () => {
      const fields = [{ name: "field1", type: "checkBox" }]
      const form = mount(<Form fields={ fields } />)
      expect(form.state("field1")).to.equal(false)
      const checkBox = findInputField(form, "field1")
      expect(checkBox.props().checked).to.equal(false)
      checkBox.simulate("change", { target: { checked: true } })
      expect(checkBox.props().checked).to.equal(true)
      expect(form.state("field1")).to.equal(true)
    })

    it("sets initial value to first option for select fields and empty string for other inputs",
      () => {
        const fields = [
          { name: "field1", type: "text" },
          { name: "field2", type: "select", options: ["option1", "option2"] }
        ]
        const form = mount(<Form fields={ fields } />)
        expect(form.state("field1")).to.equal("")
        expect(form.state("field2")).to.equal("option1")
      }
    )

    it("call set and onSubmitted with the expected data when form is submitted",
      done => {
        const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
        const onSubmittedSpy = sinon.spy()
        const setSpy = sinon.spy()
        const paramForm = mount(
          <Form
            fields={ fields }
            set={ setSpy }
            paramName={ "param" }
            onSubmitted={ onSubmittedSpy } />
        )
        const input = { field1: "value1", field2: "value2" }
        const callArgs = { backend, param: { field1: "value1", field2: "value2" } }
        callSubmitFunctions(paramForm, input, callArgs, setSpy, onSubmittedSpy, done)
      }
    )

    it("call set and onSubmitted with the expected data when form is submitted when experiment" +
      "prop is set",
      done => {
        const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
        const onSubmittedSpy = sinon.spy()
        const setSpy = sinon.spy()
        const nodeForm = mount(
          <Form
            fields={ fields }
            set={ setSpy }
            paramName={ "param" }
            experiment={ "fake-experiment" }
            onSubmitted={ onSubmittedSpy } />
        )
        const input = { field1: "value1", field2: "value2" }
        const callArgs = {
          backend,
          param: { field1: "value1", field2: "value2" },
          experimentName: "fake-experiment"
        }
        callSubmitFunctions(nodeForm, input, callArgs, setSpy, onSubmittedSpy, done)
      }
    )
  })
})
