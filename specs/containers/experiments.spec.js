/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { mount } from "enzyme"
import Experiments from "../../src/setUp/containers/experiments"
const getExperiments = require("../../src/setUp/actions/getExperiments")


describe("Experiments container", () => {
  it("calls componentDidMount", () => {
    sinon.spy(Experiments.prototype, "componentDidMount")
    mount(<Experiments />)
    expect(Experiments.prototype.componentDidMount.calledOnce).to.equal(true)
  })

  it("contains an experiment", () => {
    const experiments = [{ name: "fake-experiment" }]
    const wrapper = mount(<Experiments backend="192.168.56.77:8080" />)
    expect(wrapper.props().backend).to.equal("192.168.56.77:8080")
    wrapper.setState({ experiments })
    expect(wrapper.find(".experiment").text()).to.equal("fake-experiment")
  })

  it("renders experiments fetched from the backend", done => {
    const getMockExperiments = sinon.stub(getExperiments, "getExperiments")
      .resolves([{ name: "fake-experiment" }])
    proxyquire(
      "../../src/setUp/containers/experiments",
      { getExperiments: { getExperiments: getMockExperiments } }
    )
    const wrapper = mount(<Experiments backend="192.168.56.77:8080" />)
    expect(wrapper.state("experiments")).to.deep.equal([])
    sinon.assert.calledOnce(getMockExperiments)
    sinon.assert.calledWith(getMockExperiments, { backend: "192.168.56.77:8080" })
    setImmediate(() => {
      const experiments = JSON.stringify(wrapper.state("experiments"))
      const expectedExperiments = JSON.stringify([{ name: "fake-experiment" }])
      expect(experiments).to.equal(expectedExperiments)
      done()
    })
  })
})
