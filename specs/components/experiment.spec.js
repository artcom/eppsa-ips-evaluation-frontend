import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Experiment from "../../src/setUp/components/experiment"


describe("Experiment component", () => {
  it("contains an experiment div", () => {
    expect(shallow(<Experiment />)
      .find("div").length).to.equal(1)
  })

  it("contains an experiment div with the expected text", () => {
    expect(shallow(<Experiment>fake-experiment</Experiment>)
      .find("div").text()).to.equal("fake-experiment")
  })
})
