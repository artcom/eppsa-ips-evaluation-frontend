/* eslint-disable  import/no-commonjs */
import React from "react"
import { expect } from "chai"
import { mount, shallow } from "enzyme"
import { describe, it, beforeEach, afterEach } from "mocha"
import sinon from "sinon"
import App from "../../../../src/setUp/containers/app"
import config from "../../../../src/constants"
import DataTable from "../../../../src/setUp/components/dataTable"
import experimentsData from "../../../testData/experiments.json"
import nodesData from "../../../testData/nodes.json"
import Params from "../../../../src/setUp/containers/params"
import pointsData from "../../../testData/pointsFrontend.json"
import { addParam } from "../../../helpers/appHelpers"
import {
  deleteExperiment,
  getExperiments,
  setExperiment
} from "../../../../src/shared/actions/experimentsActions"
import { findButtonByName } from "../../../helpers/findElements"
import { checkProps } from "../../../helpers/propsHelpers"
const experimentsActions = require("../../../../src/shared/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")


describe("App Experiment", () => {
  const backend = config.backend
  let getExperimentsStub
  let getNodesStub
  let getPointsStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    getNodesStub = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    getPointsStub = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getNodesStub.restore()
    getPointsStub.restore()
  })

  describe("contains", () => {
    it("experiments when show state is \"experiments\"", () => {
      const app = shallow(<App />)
      expect(app.state("show")).to.equal("experiments")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "experiment"))
        .to.have.length(1)
    })

    it("no experiments when show state is not \"experiments\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "experiment"))
        .to.have.length(0)
    })
  })

  describe("when experiments tab is active", () => {
    let setExperimentStub
    let deleteExperimentStub

    beforeEach(() => {
      setExperimentStub = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      deleteExperimentStub = sinon.stub(experimentsActions, "deleteExperiment")
        .resolves("fake-experiment1")
    })

    afterEach(() => {
      setExperimentStub.restore()
      deleteExperimentStub.restore()
    })

    it("sends expected props to params", done => {
      const experimentFields = [{ name: "name", type: "text" }]
      const props = {
        backend,
        title: "Experiments:",
        get: getExperiments,
        set: setExperiment,
        delete: deleteExperiment,
        paramName: "experiment",
        createText: "Create Experiment"
      }
      const copyProps = {
        fields: experimentFields
      }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("experiments")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        sinon.assert.calledTwice(getExperimentsStub)
        sinon.assert.calledWith(getExperimentsStub, { backend })
        done()
      })
    })

    it("when an experiment is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        sinon.assert.calledTwice(getExperimentsStub)
        const data = {
          name: "fake-experiment3"
        }
        addParam({
          mountedComponent: app,
          paramName: "experiment",
          createText: "Create Experiment",
          data
        })
        setImmediate(() => {
          sinon.assert.calledOnce(setExperimentStub)
          sinon.assert.calledWith(setExperimentStub, { backend, experiment: data })
          done()
        })
      })
    })

    it("when an experiment is deleted, delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend, experiment: { name: "fake-experiment1" } }
      app.setState({ show: "experiments" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "experiment")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteExperimentStub)
        sinon.assert.calledWith(deleteExperimentStub, callArgs)
        done()
      })
    })

    it("when an experiment is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend }
      app.setState({ show: "experiments" })
      setImmediate(() => {
        const dataTable = app.find(Params)
          .filterWhere(params => params.props().paramName === "experiment")
          .find(DataTable)
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        setImmediate(() => {
          sinon.assert.calledThrice(getExperimentsStub)
          sinon.assert.alwaysCalledWith(getExperimentsStub, callArgs)
          done()
        })
      })
    })
  })
})
