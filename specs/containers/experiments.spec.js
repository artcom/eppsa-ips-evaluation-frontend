/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { mount, shallow } from "enzyme"
import { backend } from "../../src/constants"
import Button from "../../src/setUp/components/button"
import Experiment from "../../src/setUp/components/experiment"
import Experiments from "../../src/setUp/containers/experiments"
import Title from "../../src/setUp/components/title"
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
    expect(wrapper.find(Title)).to.have.length(1)
    expect(wrapper.find(Title).childAt(0).text()).to.equal("Experiments:")
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
    const wrapper = mount(<Experiments backend={ backend } />)
    expect(wrapper.props().backend).to.equal(backend)
    wrapper.setState({ experiments })
    expect(wrapper.find(Experiment))
      .to.have.length(2)
    expect(wrapper.find(Experiment).map(experiment => experiment.text()))
      .to.deep.equal(["experiment1", "experiment2"])
  })

  it("stores experiments retrieved from the backend in state", done => {
    const wrapper = mount(<Experiments backend={ backend } />)
    expect(wrapper.state("experiments")).to.deep.equal([])
    sinon.assert.calledOnce(global.getMockExperiments)
    sinon.assert.calledWith(global.getMockExperiments, { backend })
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

  it("contains a create experiment button", () => {
    const wrapper = shallow(<Experiments />)
    expect(wrapper.find(Button)).to.have.length(1)
    expect(wrapper.find(Button).childAt(0).text()).to.equal("Create Experiment")
  })
})
