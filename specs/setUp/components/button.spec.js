import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Button from "../../../src/setUp/components/button"


describe("Button component", () => {
  it("is a button", () => {
    expect(shallow(<Button />)
      .type()).to.equal("button")
  })
})
