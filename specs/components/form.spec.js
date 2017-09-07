import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import Input, { InputField, InputLabel } from "../../src/setUp/components/input"


describe("ExperimentForm component", () => {
  it("is a form", () => {
    expect(shallow(<ExperimentForm />)
      .type().displayName).to.equal("styled.form")
  })

  it("contains a Create submit input", () => {
    const wrapper = shallow(<ExperimentForm />)
    expect(wrapper.find(InputField)).to.have.length(1)
    expect(wrapper.find(InputField).props().type)
      .to.equal("submit")
    expect(wrapper.find(InputField).props().value)
      .to.equal("Create")
  })

  it("contains an input field", () => {
    expect(shallow(<ExperimentForm />).find(Input)).to.have.length(1)
  })

  it("input text field for experiment name with a label", () => {
    const wrapper = mount(<ExperimentForm />)
    expect(wrapper.find(Input).childAt(0).type().displayName)
      .to.equal("styled.label")
    expect(wrapper.find(Input).childAt(0).text()).to.equal("name")
    expect(wrapper.find(InputLabel).childAt(0).type().displayName)
      .to.equal("styled.input")
    expect(wrapper.find(InputLabel).childAt(0).props().type)
      .to.equal("text")
  })
})
