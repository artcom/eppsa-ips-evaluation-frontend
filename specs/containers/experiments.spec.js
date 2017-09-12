/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { concat } from "lodash"
import proxyquire from "proxyquire"
import sinon from "sinon"
import { mount, shallow } from "enzyme"
import { backend } from "../../src/constants"
import Button from "../../src/setUp/components/button"
import Experiments from "../../src/setUp/containers/experiments"
import experimentsData from "../testData/experiments.json"
import ExperimentForm from "../../src/setUp/components/experimentForm"
import {
  acknowledgeRetrieval,
  activateForm,
  activateOnSelect,
  callDeleteData,
  callsMountFunctions,
  deleteData,
  displayInTable,
  hasTable,
  hasTitle,
  hideForm,
  reloadData,
  showForm,
  storeDataInState,
  submitData
} from "../helpers/paramsHelpers"
const experimentsActions = require("../../src/setUp/actions/experimentsActions")


describe("Experiments", () => {
  describe("contains", () => {
    it("a title", () => {
      hasTitle(shallow(<Experiments />), "Experiments:")
    })

    it("a table with the expected headers", () => {
      const headers = ["name"]
      const experiments = mount(<Experiments />)
      hasTable(experiments, headers)
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
  })

  describe("for retrieval", () => {
    beforeEach(() => {
      global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
        .resolves(experimentsData)
      proxyquire(
        "../../src/setUp/containers/experiments",
        { getExperiments: { getExperiments: global.getMockExperiments } }
      )
    })

    afterEach(() => {
      global.getMockExperiments.restore()
    })

    it("calls componentDidMount and getExperiments", () => {
      callsMountFunctions(Experiments, { backend }, global.getMockExperiments, { backend })
    })

    it("stores experiments retrieved from the backend in state", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      storeDataInState(experiments, global.getMockExperiments, "experiments", experimentsData, done)
    })

    it("renders experiments that are present in state", () => {
      const experiments = mount(<Experiments backend={ backend } />)
      const expectedRows = experimentsData.map(experiment => [experiment.name, "Delete"])
      displayInTable(experiments, { experiments: experimentsData }, expectedRows)
    })

    it("sets loaded state to true when experiments have been retrieved from the backend", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      acknowledgeRetrieval(experiments, global.getMockExperiments, done)
    })
  })

  describe("for creation", () => {
    beforeEach(() => {
      global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
        .resolves([{ name: "fake-experiment1" }, { name: "fake-experiment2" }])
      proxyquire(
        "../../src/setUp/containers/experiments",
        { getExperiments: { getExperiments: global.getMockExperiments } }
      )
      global.setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
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
      activateOnSelect(experiments, "showExperimentForm", "Create Experiment", done)
    })

    it("displays an experiment form when create experiment button is pushed", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      showForm(experiments, ExperimentForm, "Create Experiment", done)
    })

    it("submits new experiment to backend when filled form is submitted", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      const submitExperiment = { name: "new-experiment" }
      const callArgs = { backend, experimentName: "new-experiment" }
      submitData(
        experiments,
        ExperimentForm,
        "Create Experiment",
        submitExperiment,
        global.setMockExperiment,
        callArgs,
        done
      )
    })

    it("hides experiment form when onSubmitted is called", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      const submitExperiment = { name: "new-experiment" }
      hideForm(
        experiments,
        ExperimentForm,
        submitExperiment,
        "showExperimentForm",
        "Create Experiment",
        global.setMockExperiment,
        done
      )
    })

    it("reloads experiments when onSubmitted is called", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      const submitExperiment = { name: "new-experiment" }
      setImmediate(() => {
        activateForm(experiments, ExperimentForm, "Create Experiment", submitExperiment)
        global.getMockExperiments.restore()
        const newData = concat(experimentsData, { name: "new-experiment" })
        global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
          .resolves(newData)
        proxyquire(
          "../../src/setUp/containers/experiments",
          { getExperiments: { getExperiments: global.getMockExperiments } }
        )
        reloadData(
          experiments,
          ExperimentForm,
          "experiments",
          global.setMockExperiment,
          global.getMockExperiments,
          newData,
          done
        )
      })
    })
  })

  describe("for deletion", () => {
    beforeEach(() => {
      global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
        .resolves([{ name: "fake-experiment1" }, { name: "fake-experiment2" }])
      proxyquire(
        "../../src/setUp/containers/experiments",
        { getExperiments: { getExperiments: global.getMockExperiments } }
      )
      global.deleteMockExperiment = sinon.stub(experimentsActions, "deleteExperiment")
        .resolves("fake-experiment1")
      proxyquire(
        "../../src/setUp/containers/experiments",
        { deleteExperiment: { deleteExperiment: global.deleteMockExperiment } }
      )
    })

    afterEach(() => {
      global.getMockExperiments.restore()
      global.deleteMockExperiment.restore()
    })

    it("calls deleteExperiment when delete button is pushed", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      const deleteArgs = { backend, experimentName: "fake-experiment1" }
      callDeleteData(experiments, global.deleteMockExperiment, deleteArgs, done)
    })

    it("reloads experiments when an experiment is deleted", done => {
      const experiments = mount(<Experiments backend={ backend } />)
      setImmediate(() => {
        global.getMockExperiments.restore()
        const remainingData = [experimentsData[1]]
        global.getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
          .resolves(remainingData)
        proxyquire(
          "../../src/setUp/containers/experiments",
          { getExperiments: { getExperiments: global.getMockExperiments } }
        )
        deleteData(experiments, "experiments", remainingData, done)
      })
    })
  })
})
