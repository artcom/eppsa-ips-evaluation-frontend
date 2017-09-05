import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import { mount } from "enzyme"
import Experiments from "../../src/setUp/containers/experiments"


describe("Experiments container", () => {
  it('calls componentDidMount', () => {
    sinon.spy(Experiments.prototype, 'componentDidMount')
    mount(<Experiments />)
    expect(Experiments.prototype.componentDidMount.calledOnce).to.equal(true)
  })
  
  it("contains an experiment", async () => {
    const experiments = [{ name: "fake-experiment"}]
    const wrapper = await mount(<Experiments backend="192.168.56.77:8080" />)
    expect(wrapper.props().backend).to.equal("192.168.56.77:8080")
    wrapper.setState({ experiments })
    expect(wrapper.find(".experiment").text()).to.equal("fake-experiment")
  })
})
