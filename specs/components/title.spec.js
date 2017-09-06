import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Title from "../../src/setUp/components/title"


describe("Title component", () => {
  it("is a div", () => {
    expect(shallow(<Title />)
      .type()).to.equal("div")
  })
})
