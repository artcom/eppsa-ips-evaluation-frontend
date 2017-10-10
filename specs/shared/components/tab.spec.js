import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Tab from "../../../src/shared/components/tab"


describe("Tab component", () => {
  it("is a div", () => {
    expect(shallow(<Tab />)
      .type()).to.equal("div")
  })
})
