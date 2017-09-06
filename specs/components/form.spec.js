import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Form from "../../src/setUp/components/form"


describe("Button component", () => {
  it("is a button", () => {
    expect(shallow(<Form />)
      .type()).to.equal("form")
  })
})
