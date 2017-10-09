import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import sinon from "sinon"
import Select, { Option } from "../../../src/setUp/components/select"


describe("Select component", () => {
  it("is a styled.div", () => {
    expect(shallow(<Select options={ [] } />)
      .type().displayName).to.equal("styled.select")
  })

  it("has option components when defined", () => {
    const options = ["option1", "option2"]
    expect(shallow(<Select options={ options } />).find(Option)).to.have.length(2)
  })

  it("has options with the expected values", () => {
    const options = ["option1", "option2"]
    const select = shallow(<Select options={ options } />)
    expect(select.find(Option).map(option => option.props().value)).to.deep.equal(options)
    expect(select.find(Option).map(option => option.childAt(0).text())).to.deep.equal(options)
  })

  it("sets the option state when value is changed", () => {
    const options = ["option1", "option2"]
    const select = shallow(<Select options={ options } onInput={ a => a } />)
    expect(select.state("value")).to.equal("option1")
    select.simulate("change", { target: { value: "option2" } })
    expect(select.state("value")).to.equal("option2")
  })

  it("calls onInput when value is changed", () => {
    const options = ["option1", "option2"]
    const onInputSpy = sinon.spy()
    const select = shallow(<Select options={ options } onInput={ onInputSpy } name="field1" />)
    expect(select.state("value")).to.equal("option1")
    select.simulate("change", { target: { value: "option2" } })
    sinon.assert.calledOnce(onInputSpy)
    sinon.assert.calledWith(onInputSpy, { target: { value: "option2" } }, "field1")
  })
})
