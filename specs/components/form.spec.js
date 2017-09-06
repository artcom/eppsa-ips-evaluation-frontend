import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Form from "../../src/setUp/components/form"
import Input from "../../src/setUp/components/input"


describe("Form component", () => {
  it("is a form", () => {
    expect(shallow(<Form />)
      .type().displayName).to.equal("styled.form")
  })

  it("contains an input field", () => {
    expect(shallow(<Form />).find(Input)).to.have.length(1)
  })
})
