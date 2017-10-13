/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import { shallow, mount } from "enzyme"
import App from "../../../src/analyze/containers/app"
import config from "../../../src/constants"
import experiments from "../../testData/experiments.json"
import experimentMetrics from "../../testData/experimentMetrics.json"
import Form from "../../../src/shared/components/form"
import { findButtonByName } from "../../helpers/findElements"
import inputData from "../../helpers/inputData"
import { checkProps } from "../../helpers/propsHelpers"
import positionData from "../../testData/positionDataGoIndoor.json"
import SelectCategory from "../../../src/shared/components/selectCategory"
import Tab from "../../../src/shared/components/tab"
import TabBar from "../../../src/shared/components/tabBar"
const experimentsActions = require("../../../src/shared/actions/experimentsActions")
const experimentMetricsActions = require("../../../src/analyze/actions/experimentMetricsActions")
const navigate = require("../../../src/shared/actions/navigate")
const positionDataActions = require("../../../src/analyze/actions/positionDataActions")


describe("App Analyze", () => {
  const backend = config.backend
  const frontend = config.frontend
  let getExperimentsStub
  let getPositionDataStub
  let navigateStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experiments)
    getPositionDataStub = sinon.stub(positionDataActions, "getPositionData")
      .resolves(positionData)
    navigateStub = sinon.stub(navigate, "navigate")
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getPositionDataStub.restore()
    navigateStub.restore()
  })

  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("tabs", () => {
      const tabs = ["PointErrors", "ExperimentMetrics", "SetUp"]
      const app = mount(<App />)
      expect(app.find(TabBar).find(Tab)).to.have.length(tabs.length)
      expect(app.find(TabBar).find(Tab).map(tab => tab.text())).to.deep.equal(tabs)
    })

    it("an experiment selection component when loaded and no experiment is selected", done => {
      const app = shallow(<App />)
      setImmediate(() => {
        app.setState({ loaded: true, selectedExperiment: false, show: "pointErrors" })
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
        app.setState({ loaded: true, selectedExperiment: true, show: "pointErrors" })
        expect(
          app.find(SelectCategory)
            .filterWhere(select => select.props().title === "Select Experiment:")
        ).to.have.length(0)
        done()
      })
    })

    it("no experiment selection component when loaded no experiment is selected " +
      "and show is not pointErrors",
      done => {
        const app = shallow(<App />)
        setImmediate(() => {
          app.setState({ loaded: true, selectedExperiment: false, show: "other" })
          expect(
            app.find(SelectCategory)
              .filterWhere(select => select.props().title === "Select Experiment:")
          ).to.have.length(0)
          done()
        })
      }
    )

    it("an experiment selection checkbox for selecting experiments to compare", done => {
      const app = shallow(<App />)
      setImmediate(() => {
        app.setState({ loaded: true, compareExperiments: [], show: "experimentMetrics" })
        expect(app.find(Form)).to.have.length(1)
        done()
      })
    })
  })

  describe("activates", () => {
    it("ExperimentMetrics when experimentMetrics tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("pointErrors")
        const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "ExperimentMetrics")
        pointsTab.simulate("click")
        expect(pointsTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("experimentMetrics")
        done()
      })
    })

    it("SetUp when setUp tab is clicked and navigates to /set-up", done => {
      const app = mount(<App backend={ backend } frontend={ frontend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("pointErrors")
        const analyzeButton = app.find(Tab).filterWhere(tab => tab.text() === "SetUp")
        analyzeButton.simulate("click")
        setTimeout(() => {
          sinon.assert.calledOnce(navigateStub)
          sinon.assert.calledWith(navigateStub, `${frontend}/set-up`)
          done()
        }, 200)
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
    let getExperimentMetricsStub

    beforeEach(() => {
      getExperimentMetricsStub = sinon.stub(experimentMetricsActions, "getExperimentMetrics")
        .resolves(experimentMetrics)
    })

    afterEach(() => {
      getExperimentMetricsStub.restore()
    })

    it("send expected props to selectCategory", done => {
      const props = { categories: experiments, title: "Select Experiment:" }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        const selectExperiment = app.find(SelectCategory)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("send expected props to experiment selection form", done => {
      const fields = [
        { name: "fake-experiment1", type: "checkBox" },
        { name: "fake-experiment2", type: "checkBox" }
      ]
      const props = { fields }
      const app = mount(<App backend={ backend } />)
      app.setState({ loaded: true, compareExperiments: [], show: "experimentMetrics" })
      setImmediate(() => {
        const form = app.find(Form)
          .filterWhere(select => select.props().submitName === "Compare")
        expect(form).to.have.length(1)
        checkProps({ mountedComponent: form, props, copy: true })
        done()
      })
    })

    it("set the selected experiments in compareExperiments state when experiment selection form " +
      "is submitted", done => {
      const data = {}
      data["fake-experiment1"] = false
      data["fake-experiment2"] = true
      const app = mount(<App backend={ backend } />)
      app.setState({ loaded: true, compareExperiments: [], show: "experimentMetrics" })
      setImmediate(() => {
        const form = app.find(Form)
          .filterWhere(select => select.props().submitName === "Compare")
        inputData(form, data)
        form.simulate("submit")
        setImmediate(() => {
          expect(app.state("compareExperiments"))
            .to.deep.equal(["fake-experiment2"])
          done()
        })
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

    it("call getPositionData for the experiment when an experiment is selected", done => {
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

    it("call getExperimentMetrics for the selected experiments when Compare button is pushed",
      done => {
        const data = {}
        data["fake-experiment1"] = false
        data["fake-experiment2"] = true
        const app = mount(<App backend={ backend } />)
        app.setState({ loaded: true, compareExperiments: [], show: "experimentMetrics" })
        setImmediate(() => {
          const form = app.find(Form)
            .filterWhere(select => select.props().submitName === "Compare")
          inputData(form, data)
          form.simulate("submit")
          setImmediate(() => {
            sinon.assert.calledOnce(getExperimentMetricsStub)
            sinon.assert.calledWith(
              getExperimentMetricsStub,
              { backend, experimentName: "fake-experiment2" }
            )
            done()
          })
        })
      }
    )

    it("stores experiment metrics in state when Compare button is pushed", done => {
      const data = {}
      data["fake-experiment1"] = false
      data["fake-experiment2"] = true
      const app = mount(<App backend={ backend } />)
      app.setState({ loaded: true, compareExperiments: [], show: "experimentMetrics" })
      setImmediate(() => {
        const form = app.find(Form)
          .filterWhere(select => select.props().submitName === "Compare")
        inputData(form, data)
        form.simulate("submit")
        setImmediate(() => {
          setImmediate(() => {
            expect(app.state("experimentMetrics"))
              .to.deep.equal([experimentMetrics])
            done()
          })
        })
      })
    })
  })
})
