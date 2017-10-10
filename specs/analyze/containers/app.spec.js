/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/analyze/containers/app"
import config from "../../../src/constants"
import experiments from "../../testData/experiments.json"
import { findButtonByName } from "../../helpers/findElements"
import { checkProps } from "../../helpers/propsHelpers"
import positionData from "../../testData/positionData.json"
import SelectCategory from "../../../src/shared/components/selectCategory"
import Tab from "../../../src/shared/components/tab"
import TabBar from "../../../src/shared/components/tabBar"
const experimentsActions = require("../../../src/shared/actions/experimentsActions")
const positionDataActions = require("../../../src/analyze/actions/positionDataActions")


describe("App Analyze", () => {
  const backend = config.backend
  let getExperimentsStub
  let getPositionDataStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experiments)
    proxyquire(
      "../../../src/analyze/containers/app",
      { getExperiments: getExperimentsStub }
    )
    getPositionDataStub = sinon.stub(positionDataActions, "getPositionData")
      .resolves(positionData)
    proxyquire(
      "../../../src/analyze/containers/app",
      { getPositionData: getPositionDataStub }
    )
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getPositionDataStub.restore()
  })

  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("tabs", () => {
      const tabs = ["PointErrors", "ExperimentMetrics"]
      const app = mount(<App />)
      expect(app.find(TabBar).find(Tab)).to.have.length(tabs.length)
      expect(app.find(TabBar).find(Tab).map(tab => tab.text())).to.deep.equal(tabs)
    })

    it("an experiment selection component when loaded and no experiment is selected", done => {
      const app = shallow(<App />)
      setImmediate(() => {
        app.setState({ loaded: true, selectedExperiment: false })
        expect(
          app.find(SelectCategory)
            .filterWhere(select => select.props().title === "Select Experiment:")
        ).to.have.length(1)
        done()
      })
    })

    it("no experiment selection component when loaded and an experiment is selected", done => {
      const app = shallow(<App />)
      setImmediate(() => {
        app.setState({ loaded: true, selectedExperiment: true })
        expect(
          app.find(SelectCategory)
            .filterWhere(select => select.props().title === "Select Experiment:")
        ).to.have.length(0)
        done()
      })
    })
  })

  describe("loads", () => {
    it("experiments into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getExperimentsStub)
      setImmediate(() => {
        expect(app.state("experiments")).to.deep.equal(experiments)
        done()
      })
    })
  })

  describe("does", () => {
    it("send expected props to selectCategory", done => {
      const props = { categories: experiments, title: "Select Experiment:" }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        const selectExperiment = app.find(SelectCategory)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("set the selected experiment in state when an experiment is selected", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        const selectExperiment = app.find(SelectCategory)
        findButtonByName(selectExperiment, experiments[0].name).simulate("click")
        setImmediate(() => {
          expect(app.state("selectedExperiment")).to.equal(experiments[0].name)
          done()
        })
      })
    })

    it("calls getPositionData for the experiment when an experiment is selected", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        const selectExperiment = app.find(SelectCategory)
        findButtonByName(selectExperiment, experiments[0].name).simulate("click")
        sinon.assert.calledOnce(getPositionDataStub)
        sinon.assert.calledWith(
          getPositionDataStub,
          { backend, experimentName: experiments[0].name }
        )
        done()
      })
    })

    it("load the position data in state for the experiment when an experiment is selected",
      done => {
        const app = mount(<App backend={ backend } />)
        setImmediate(() => {
          const selectExperiment = app.find(SelectCategory)
          findButtonByName(selectExperiment, experiments[0].name).simulate("click")
          setImmediate(() => {
            expect(app.state("positionData")).to.deep.equal(positionData)
            done()
          })
        })
      }
    )
  })
})
