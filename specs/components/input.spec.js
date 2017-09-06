import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Input, { InputName, InputField } from "../../src/setUp/components/input"


describe("Input component", () => {
  it("is a styled.div", () => {
    expect(shallow(<Input />)
      .type().displayName).to.equal("styled.div")
  })

  it("contains an input name", () => {
    expect(shallow(<Input />)
      .find(InputName)).to.have.length(1)
  })

  it("contains an input field", () => {
    expect(shallow(<Input />)
      .find(InputField)).to.have.length(1)
  })
})
