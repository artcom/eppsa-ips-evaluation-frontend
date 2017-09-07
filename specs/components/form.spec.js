import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import Input, { InputField } from "../../src/setUp/components/input"


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

  it("contains an input field corresponding to fields props", () => {
    const fields = [{ name: "name", type: "text" }]
    expect(shallow(<ExperimentForm fields={ fields } />).find(Input)).to.have.length(1)
  })

  it("generates fields with a name and an input", () => {
    const fields = [{ name: "name", type: "text" }]
    const wrapper = mount(<ExperimentForm fields={ fields } />)
    expect(wrapper.find(Input).childAt(0).type().displayName)
      .to.equal("styled.div")
    expect(wrapper.find(Input).childAt(0).text()).to.equal("name")
    expect(wrapper.find(Input).childAt(1).type().displayName)
      .to.equal("styled.input")
    expect(wrapper.find(Input).childAt(1).props().type)
      .to.equal("text")
  })
})
