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
import ExperimentForm from "../../src/setUp/components/experimentForm"
import { InputField, InputLabel } from "../../src/setUp/components/input"
import Title from "../../src/setUp/components/title"
const getExperiments = require("../../src/setUp/actions/getExperiments")
const setExperiment = require("../../src/setUp/actions/setExperiment")

describe("Experiments", () => {
  describe("contains", () => {
    it("a title", () => {
      const wrapper = shallow(<Experiments />)
      expect(wrapper.find(Title)).to.have.length(1)
      expect(wrapper.find(Title).childAt(0).text()).to.equal("Experiments:")
    })

    it("no create experiment button when loaded state is false", () => {
      const wrapper = shallow(<Experiments />)
      expect(wrapper.state("loaded")).to.equal(false)
      expect(wrapper.find(Button)).to.have.length(0)
    })

    it("a create experiment button when loaded state is true", () => {
      const wrapper = shallow(<Experiments />)
      wrapper.setState({ loaded: true })
      expect(wrapper.find(Button)).to.have.length(1)
      expect(wrapper.find(Button).childAt(0).text()).to.equal("Create Experiment")
    })

    it("no experiment form when showExperimentForm state is false", () => {
      const wrapper = shallow(<Experiments />)
      expect(wrapper.state("showExperimentForm")).to.equal(false)
      expect(wrapper.find(ExperimentForm)).to.have.length(0)
    })

    it("an experiment form when showExperimentForm state is true", () => {
      const wrapper = shallow(<Experiments />)
      wrapper.setState({ showExperimentForm: true })
      expect(wrapper.find(ExperimentForm)).to.have.length(1)
    })
  })

  describe("for retrieval", () => {
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

    it("sets loaded state to true when experiments have been retrieved from the backend", done => {
      const wrapper = mount(<Experiments backend={ backend } />)
      expect(wrapper.state("loaded")).to.equal(false)
      setImmediate(() => {
        expect(wrapper.state("loaded")).to.equal(true)
        done()
      })
    })
  })

  describe("for creation", () => {
    beforeEach(() => {
      global.getMockExperiments = sinon.stub(getExperiments, "getExperiments")
        .resolves([{ name: "fake-experiment1" }, { name: "fake-experiment2" }])
      proxyquire(
        "../../src/setUp/containers/experiments",
        { getExperiments: { getExperiments: global.getMockExperiments } }
      )
      global.setMockExperiment = sinon.stub(setExperiment, "setExperiment")
        .resolves("new-experiment")
      proxyquire(
        "../../src/setUp/components/experimentForm",
        { setExperiment: { setExperiment: global.setMockExperiment } }
      )
    })

    afterEach(() => {
      global.getMockExperiments.restore()
      global.setMockExperiment.restore()
    })

    it("sets showExperimentForm state to true when create experiment button is pushed", done => {
      const wrapper = mount(<Experiments backend={ backend } />)
      expect(wrapper.state("showExperimentForm")).to.equal(false)
      setImmediate(() => {
        wrapper.find(Button).simulate("click")
        expect(wrapper.state("showExperimentForm")).to.equal(true)
        done()
      })
    })

    it("displays an experiment form when create experiment button is pushed", done => {
      const wrapper = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        expect(wrapper.find(ExperimentForm)).to.have.length(0)
        wrapper.find(Button).simulate("click")
        expect(wrapper.find(ExperimentForm)).to.have.length(1)
        done()
      })
    })

    it("hides experiment form when onSubmitted is called", done => {
      const wrapper = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        expect(wrapper.find(ExperimentForm)).to.have.length(0)
        wrapper.find(Button).simulate("click")
        expect(wrapper.find(ExperimentForm)).to.have.length(1)
        const experimentNameInputField = wrapper
          .find(ExperimentForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        experimentNameInputField.simulate("change", { target: { value: "new-experiment" } })
        wrapper.find(ExperimentForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockExperiment)
        expect(wrapper.state("showExperimentForm")).to.equal(false)
        expect(wrapper.find(ExperimentForm)).to.have.length(0)
        done()
      })
    })
  })
})
