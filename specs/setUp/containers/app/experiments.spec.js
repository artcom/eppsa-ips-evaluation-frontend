/* eslint-disable  import/no-commonjs */
import React from "react"
import { expect } from "chai"
import { mount, shallow } from "enzyme"
import { describe, it, beforeEach, afterEach } from "mocha"
import proxyquire from "proxyquire"
import sinon from "sinon"
import App from "../../../../src/setUp/containers/app"
import config from "../../../../src/constants"
import DataTable from "../../../../src/setUp/components/dataTable"
import experimentsData from "../../../testData/experiments.json"
import nodesData from "../../../testData/nodes.json"
import Params from "../../../../src/setUp/containers/params"
import pointsData from "../../../testData/pointsFrontend.json"
import { addParam } from "../../helpers/appHelpers"
import {
  deleteExperiment,
  getExperiments,
  setExperiment
} from "../../../../src/setUp/actions/experimentsActions"
import { findButtonByName } from "../../helpers/findElements"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")


describe("App Experiment", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
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
    let setMockExperiment
    let deleteMockExperiment

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
      deleteMockExperiment = sinon.stub(experimentsActions, "deleteExperiment")
        .resolves("fake-experiment1")
      proxyquire("../../../../src/setUp/containers/app", { deleteExperiment: deleteMockExperiment })
    })

    afterEach(() => {
      setMockExperiment.restore()
      deleteMockExperiment.restore()
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
        sinon.assert.calledTwice(getMockExperiments)
        sinon.assert.calledWith(getMockExperiments, { backend })
        done()
      })
    })

    it("when an experiment is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "experiments" })
        sinon.assert.calledTwice(getMockExperiments)
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
          sinon.assert.calledOnce(setMockExperiment)
          sinon.assert.calledWith(setMockExperiment, { backend, experiment: data })
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
        sinon.assert.calledOnce(deleteMockExperiment)
        sinon.assert.calledWith(deleteMockExperiment, callArgs)
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
          sinon.assert.calledThrice(getMockExperiments)
          sinon.assert.alwaysCalledWith(getMockExperiments, callArgs)
          done()
        })
      })
    })
  })
})
