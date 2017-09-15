import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Select, { Option } from "../../src/setUp/components/select"


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
})
