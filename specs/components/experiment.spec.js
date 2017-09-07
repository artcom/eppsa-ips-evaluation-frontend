import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Button from "../../src/setUp/components/button"
import Experiment, { Name } from "../../src/setUp/components/experiment"


describe("Experiment component", () => {
  it("is a div", () => {
    expect(shallow(<Experiment name="test-experiment" />)
      .type().displayName).to.equal("styled.div")
  })

  it("displays a name", () => {
    const experiment = shallow(<Experiment name="test-experiment" />)
    const name = experiment.find(Name)
    expect(name.type().displayName).to.equal("styled.div")
    expect(name.childAt(0).text()).to.equal("test-experiment")
  })

  it("contains a delete button", () => {
    const experiment = shallow(<Experiment name="test-experiment" />)
    expect(experiment.find(Button)).to.have.length(1)
    expect(experiment.find(Button).childAt(0).text()).to.equal("Delete")
  })
})
