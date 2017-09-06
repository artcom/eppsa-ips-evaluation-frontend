import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Experiment from "../../src/setUp/components/experiment"


describe("Experiment component", () => {
  it("contains an experiment div", async () => {
    expect(shallow(<Experiment />)
      .find("div").length).to.equal(1)
  })

  it("contains an experiment div with the expected text", async () => {
    expect(shallow(<Experiment experimentName="fake-experiment" />)
      .find("div").text()).to.equal("fake-experiment")
  })
})
