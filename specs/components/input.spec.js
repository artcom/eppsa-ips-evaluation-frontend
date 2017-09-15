import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Input, { InputLabel, InputField } from "../../src/setUp/components/input"
import Select from "../../src/setUp/components/select"


describe("Input component", () => {
  it("is a styled.div", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .type().displayName).to.equal("styled.div")
  })

  it("contains an input name", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .find(InputLabel)).to.have.length(1)
  })

  it("contains an input field", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .find(InputField)).to.have.length(1)
  })

  it("contains a select field when type is select", () => {
    const field = { name: "name", type: "select" }
    expect(shallow(<Input field={ field } />)
      .find(Select)).to.have.length(1)
  })
})
