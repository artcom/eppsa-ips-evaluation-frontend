/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { mount, shallow } from "enzyme"
import { backend } from "../../src/constants"
import Button from "../../src/setUp/components/button"
import Experiment, { Name } from "../../src/setUp/components/experiment"
import Experiments from "../../src/setUp/containers/experiments"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import { InputField, InputLabel } from "../../src/setUp/components/input"
import Title from "../../src/setUp/components/title"
const getExperiments = require("../../src/setUp/actions/getExperiments")
const setExperiment = require("../../src/setUp/actions/setExperiment")

describe("Experiments", () => {
  describe("contains", () => {
    it("a title", () => {
      const experiments = shallow(<Experiments />)
      expect(experiments.find(Title)).to.have.length(1)
      expect(experiments.find(Title).childAt(0).text()).to.equal("Experiments:")
    })

    it("no create experiment button when loaded state is false", () => {
      const experiments = shallow(<Experiments />)
      expect(experiments.state("loaded")).to.equal(false)
      expect(experiments.find(Button)).to.have.length(0)
    })

    it("a create experiment button when loaded state is true", () => {
      const experiments = shallow(<Experiments />)
      experiments.setState({ loaded: true })
      expect(experiments.find(Button)).to.have.length(1)
      expect(experiments.find(Button).childAt(0).text()).to.equal("Create Experiment")
    })

    it("no experiment form when showExperimentForm state is false", () => {
      const experiments = shallow(<Experiments />)
      expect(experiments.state("showExperimentForm")).to.equal(false)
      expect(experiments.find(ExperimentForm)).to.have.length(0)
    })

    it("an experiment form when showExperimentForm state is true", () => {
      const experiments = shallow(<Experiments />)
      experiments.setState({ showExperimentForm: true })
      expect(experiments.find(ExperimentForm)).to.have.length(1)
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
      const expectedExperiments = [{ name: "experiment1" }, { name: "experiment2" }]
      const experiments = mount(<Experiments backend={ backend } />)
      expect(experiments.props().backend).to.equal(backend)
      experiments.setState({ experiments: expectedExperiments })
      expect(experiments.find(Experiment))
        .to.have.length(2)
      expect(experiments.find(Name).map(name => name.text()))
        .to.deep.equal(["experiment1", "experiment2"])
    })

    it("stores experiments retrieved from the backend in state", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      expect(experiments.state("experiments")).to.deep.equal([])
      sinon.assert.calledOnce(global.getMockExperiments)
      sinon.assert.calledWith(global.getMockExperiments, { backend })
      setImmediate(() => {
        const storedExperiments = JSON.stringify(experiments.state("experiments"))
        const expectedExperiments = JSON.stringify([
          { name: "fake-experiment1" },
          { name: "fake-experiment2" }
        ])
        expect(storedExperiments).to.equal(expectedExperiments)
        done()
      })
    })

    it("sets loaded state to true when experiments have been retrieved from the backend", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      expect(experiments.state("loaded")).to.equal(false)
      setImmediate(() => {
        expect(experiments.state("loaded")).to.equal(true)
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
      const experiments = mount(<Experiments backend={ backend } />)
      expect(experiments.state("showExperimentForm")).to.equal(false)
      setImmediate(() => {
        const createExperimentButton = experiments
          .find(Button)
          .filterWhere(button => button.text() === "Create Experiment")
        createExperimentButton.simulate("click")
        expect(experiments.state("showExperimentForm")).to.equal(true)
        done()
      })
    })

    it("displays an experiment form when create experiment button is pushed", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        expect(experiments.find(ExperimentForm)).to.have.length(0)
        const createExperimentButton = experiments
          .find(Button)
          .filterWhere(button => button.text() === "Create Experiment")
        createExperimentButton.simulate("click")
        expect(experiments.find(ExperimentForm)).to.have.length(1)
        done()
      })
    })

    it("hides experiment form when onSubmitted is called", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        expect(experiments.find(ExperimentForm)).to.have.length(0)
        const createExperimentButton = experiments
          .find(Button)
          .filterWhere(button => button.text() === "Create Experiment")
        createExperimentButton.simulate("click")
        expect(experiments.find(ExperimentForm)).to.have.length(1)
        const experimentNameInputField = experiments
          .find(ExperimentForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        experimentNameInputField.simulate("change", { target: { value: "new-experiment" } })
        experiments.find(ExperimentForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockExperiment)
        setImmediate(() => {
          expect(experiments.state("showExperimentForm")).to.equal(false)
          expect(experiments.find(ExperimentForm)).to.have.length(0)
          done()
        })
      })
    })

    it("reloads experiments when onSubmitted is called", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        expect(experiments.find(ExperimentForm)).to.have.length(0)
        const createExperimentButton = experiments
          .find(Button)
          .filterWhere(button => button.text() === "Create Experiment")
        createExperimentButton.simulate("click")
        expect(experiments.find(ExperimentForm)).to.have.length(1)
        const experimentNameInputField = experiments
          .find(ExperimentForm)
          .find(InputLabel)
          .filterWhere(field => field.text() === "name")
          .find(InputField)
        experimentNameInputField.simulate("change", { target: { value: "new-experiment" } })
        global.getMockExperiments.restore()
        global.getMockExperiments = sinon.stub(getExperiments, "getExperiments")
          .resolves([
            { name: "fake-experiment1" },
            { name: "fake-experiment2" },
            { name: "new-experiment" }
          ])
        proxyquire(
          "../../src/setUp/containers/experiments",
          { getExperiments: { getExperiments: global.getMockExperiments } }
        )
        experiments.find(ExperimentForm).simulate("submit")
        sinon.assert.calledOnce(global.setMockExperiment)
        setImmediate(() => {
          sinon.assert.calledOnce(global.getMockExperiments)
          const storedExperiments = JSON.stringify(experiments.state("experiments"))
          const expectedExperiments = JSON.stringify([
            { name: "fake-experiment1" },
            { name: "fake-experiment2" },
            { name: "new-experiment" }
          ])
          expect(storedExperiments).to.equal(expectedExperiments)
          done()
        })
      })
    })
  })
})
