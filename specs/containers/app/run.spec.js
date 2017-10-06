/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/setUp/containers/app"
import config from "../../../src/constants"
import experimentsData from "../../testData/experiments.json"
import Form from "../../../src/setUp/components/form"
import inputData from "../../helpers/inputData"
import nodesData from "../../testData/nodes.json"
import pointsData from "../../testData/pointsFrontend.json"
import Run from "../../../src/setUp/containers/run"
import SelectCategory from "../../../src/setUp/components/selectCategory"
import zoneSets from "../../testData/zoneSets.json"
import { findButtonByName } from "../../helpers/findElements"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")
const zoneSetsActions = require("../../../src/setUp/actions/zoneSetsActions")


describe("App Run", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockZoneSets
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockZoneSets = sinon.stub(zoneSetsActions, "getZoneSets").resolves(zoneSets)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getZoneSets: getMockZoneSets }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockZoneSets.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    it("Run when show state is \"run\" and an experiment is selected",
      done => {
        const app = mount(<App />)
        app.setState({
          show: "run",
          loaded: true,
          selectedExperiment: "fake-experiment",
          experiments: [{ name: "fake-experiment" }]
        })
        setImmediate(() => {
          expect(app.find(Run)).to.have.length(1)
          expect(findButtonByName(app, "Select Other Experiment")).to.have.length(1)
          done()
        })
      }
    )

    it("no Run when show state is \"run\" but no experiment is selected",
      () => {
        const app = shallow(<App />)
        app.setState({ show: "run", loaded: true, selectedExperiment: false })
        expect(app.find(Run)).to.have.length(0)
      }
    )

    it("an experiment selection component when show state is \"run\" but no experiment is selected",
      done => {
        const app = shallow(<App />)
        setImmediate(() => {
          app.setState({ show: "run", loaded: true, selectedExperiment: false })
          expect(app.find(SelectCategory)).to.have.length(1)
          done()
        })
      }
    )

    it("no Run when show state is not \"run\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other", loaded: true })
      expect(app.find(Run)).to.have.length(0)
    })
  })

  describe("when Run tab is active", () => {
    let runMockExperiment

    beforeEach(() => {
      runMockExperiment = sinon.stub(experimentsActions, "runExperiment")
        .resolves("fake-experiment1")
      proxyquire(
        "../../../src/setUp/containers/app",
        { runExperiment: runMockExperiment }
      )
    })

    afterEach(() => {
      runMockExperiment.restore()
    })

    it("sends expected props to Run", done => {
      const runFields = [
        { name: "Quuppa", type: "checkBox" },
        { name: "GoIndoor", type: "checkBox" },
        { name: "repeats", type: "text" },
        { name: "interval", type: "text" }
      ]
      const props = {
        title: "Set up \"fake-experiment1\":",
        experimentName: "fake-experiment1",
      }
      const copyProps = { fields: runFields }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "run", selectedExperiment: "fake-experiment1" })
        const run = app.find(Run)

        expect(app.state("show")).to.equal("run")
        expect(run).to.have.length(1)
        checkProps({ mountedComponent: run, props })
        checkProps({ mountedComponent: run, props: copyProps, copy: true })
        done()
      })
    })

    it("sends expected props to selectExperiment", done => {
      const props = { categories: experimentsData }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "run" })
        const selectExperiment = app.find(SelectCategory)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("when an experiment is selected the selected experiment is set in state", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "run" })
        const selectExperiment = app.find(SelectCategory)
        findButtonByName(selectExperiment, "fake-experiment1").simulate("click")
        expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
        done()
      })
    })

    it("sets selectedExperiment state to null when select other experiment button is pushed",
      done => {
        const app = mount(<App backend={ backend } />)
        setImmediate(() => {
          app.setState({ show: "run", selectedExperiment: "fake-experiment1" })
          expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
          findButtonByName(app, "Select Other Experiment").simulate("click")
          expect(app.state("selectedExperiment")).to.equal(null)
          done()
        })
      }
    )

    it("when set up form is filled and submitted set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "run", selectedExperiment: "fake-experiment1" })
        const data = {
          Quuppa: true,
          GoIndoor: true,
          repeats: 4,
          interval: 2
        }
        setImmediate(() => {
          const run = app.find(Run)
          findButtonByName(run, "Set Up").simulate("click")
          const form = run.find(Form)
          inputData(form, data)
          form.simulate("submit")

          sinon.assert.calledOnce(runMockExperiment)
          sinon.assert.calledWith(
            runMockExperiment,
            { backend, experimentName: "fake-experiment1", run: data }
          )
          done()
        })
      })
    })
  })
})
