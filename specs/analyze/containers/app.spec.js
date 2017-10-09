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
const experimentsActions = require("../../../src/shared/actions/experimentsActions")
const positionDataActions = require("../../../src/analyze/actions/positionDataActions")


describe("App NodePositions", () => {
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
    it("an experiment selection component", done => {
      const app = shallow(<App />)
      setImmediate(() => {
        expect(app.find(SelectCategory)).to.have.length(1)
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
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectCategory)
        findButtonByName(selectExperiment, "fake-experiment1").simulate("click")
        expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
        done()
      })
    })
  })
})
