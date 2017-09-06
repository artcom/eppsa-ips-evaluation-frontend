/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { mount, shallow } from "enzyme"
import Experiments from "../../src/setUp/containers/experiments"
const getExperiments = require("../../src/setUp/actions/getExperiments")


describe("Experiments container", () => {
  beforeEach(() => {
    global.getMockExperiments = sinon.stub(getExperiments, "getExperiments")
      .resolves([{ name: "fake-experiment1" }, { name: "fake-experiment2" }])
    proxyquire(
      "../../src/setUp/containers/experiments",
      { getExperiments: { getExperiments: global.getMockExperiments } }
    )
  })

  afterEach(() => {
    global.getMockExperiments.restore()
  })

  it("contains a title", () => {
    const wrapper = shallow(<Experiments />)
    expect(wrapper.childAt(0).type().displayName).to.equal("styled.div")
    expect(wrapper.childAt(0).childAt(0).text()).to.equal("Experiments:")
  })

  it("calls componentDidMount and getExperiments", () => {
    const componentDidMount = sinon.spy(Experiments.prototype, "componentDidMount")
    mount(<Experiments />)
    expect(Experiments.prototype.componentDidMount.calledOnce).to.equal(true)
    sinon.assert.calledOnce(global.getMockExperiments)
    componentDidMount.restore()
  })

  it("renders experiments that are present in state", () => {
    const experiments = [{ name: "experiment1" }, { name: "experiment2" }]
    const wrapper = mount(<Experiments backend="192.168.56.77:8080" />)
    expect(wrapper.props().backend).to.equal("192.168.56.77:8080")
    wrapper.setState({ experiments })
    expect(wrapper.children().map(child => child.text()))
      .to.deep.equal(["experiment1", "experiment2"])
  })

  it("stores experiments fetched from the backend in state", done => {
    const wrapper = mount(<Experiments backend="192.168.56.77:8080" />)
    expect(wrapper.state("experiments")).to.deep.equal([])
    sinon.assert.calledOnce(global.getMockExperiments)
    sinon.assert.calledWith(global.getMockExperiments, { backend: "192.168.56.77:8080" })
    setImmediate(() => {
      const experiments = JSON.stringify(wrapper.state("experiments"))
      const expectedExperiments = JSON.stringify([
        { name: "fake-experiment1" },
        { name: "fake-experiment2" }
      ])
      expect(experiments).to.equal(expectedExperiments)
      done()
    })
  })
})
