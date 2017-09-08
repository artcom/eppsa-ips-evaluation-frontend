/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { backend } from "../../src/constants"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import Input, { InputField, InputLabel } from "../../src/setUp/components/input"
const experimentActions = require("../../src/setUp/actions/experimentsActions")


describe("ExperimentForm component", () => {
  it("is a form", () => {
    expect(shallow(<ExperimentForm />)
      .type().displayName).to.equal("styled.form")
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      const wrapper = shallow(<ExperimentForm />)
      expect(wrapper.find(InputField)).to.have.length(1)
      expect(wrapper.find(InputField).props().type)
        .to.equal("submit")
      expect(wrapper.find(InputField).props().value)
        .to.equal("Create")
    })

    it("an input field", () => {
      expect(shallow(<ExperimentForm />).find(Input)).to.have.length(1)
    })

    it("an input text field for experiment name with a label", () => {
      const wrapper = mount(<ExperimentForm />)
      expect(wrapper.find(Input).childAt(0).type().displayName)
        .to.equal("styled.label")
      expect(wrapper.find(Input).childAt(0).text()).to.equal("name")
      expect(wrapper.find(InputLabel).childAt(0).type().displayName)
        .to.equal("styled.input")
      expect(wrapper.find(InputLabel).childAt(0).props().type)
        .to.equal("text")
      expect(wrapper.find(InputLabel).childAt(0).props().value)
        .to.equal("")
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
      const wrapper = mount(<ExperimentForm />)
      const experimentNameInputField = wrapper
        .find(InputLabel)
        .filterWhere(field => field.text() === "name")
        .find(InputField)
      experimentNameInputField.simulate("change", { target: { value: "new-experiment" } })
      expect(wrapper.state("name")).to.equal("new-experiment")
    })

    it("calls setExperiment and onSubmitted with the expected name when form is submitted",
      done => {
        const onSubmitted = sinon.spy()
        const wrapper = mount(<ExperimentForm onSubmitted={ onSubmitted } />)
        wrapper.setState({ name: "new-experiment" })
        wrapper.simulate("submit")
        sinon.assert.calledOnce(global.setMockExperiment)
        sinon.assert.calledWith(
          global.setMockExperiment,
          { backend, experimentName: "new-experiment" }
        )
        setImmediate(() => {
          sinon.assert.calledOnce(onSubmitted)
          done()
        })
      })
  })
})
