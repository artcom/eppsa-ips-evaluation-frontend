import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Experiment from "../../src/setUp/components/experiment"


describe("Experiment component", () => {
  it("is a div", () => {
    expect(shallow(<Experiment />)
      .type()).to.equal("div")
  })
})
