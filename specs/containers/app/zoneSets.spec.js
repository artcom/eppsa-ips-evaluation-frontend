/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/setUp/containers/app"
import config from "../../../src/constants"
import DataTable from "../../../src/setUp/components/dataTable"
import experimentsData from "../../testData/experiments.json"
import nodesData from "../../testData/nodes.json"
import Params from "../../../src/setUp/containers/params"
import pointsData from "../../testData/pointsFrontend.json"
import { addParam } from "../../helpers/appHelpers"
import { findButtonByName } from "../../helpers/findElements"
import { checkProps } from "../../helpers/propsHelpers"
import { getZoneSets, setZoneSet, deleteZoneSet } from "../../../src/setUp/actions/zoneSetsActions"
import zoneSets from "../../testData/zoneSets.json"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")
const zoneSetsActions = require("../../../src/setUp/actions/zoneSetsActions")


describe("App ZoneSets", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
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
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    it("zoneSets when show state is \"zoneSets\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "zoneSets" })
      expect(app.state("show")).to.equal("zoneSets")
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zoneSet"))
        .to.have.length(1)
    })

    it("no zoneSets when show state is not \"zoneSets\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zoneSet"))
        .to.have.length(0)
    })
  })

  describe("when zoneSets tab is active", () => {
    let getMockZoneSets
    let setMockZoneSet
    let deleteMockZoneSet

    beforeEach(() => {
      getMockZoneSets = sinon.stub(zoneSetsActions, "getZoneSets")
        .resolves(zoneSets)
      proxyquire(
        "../../../src/setUp/containers/app",
        { getZoneSets: getMockZoneSets }
      )
      setMockZoneSet = sinon.stub(zoneSetsActions, "setZoneSet").resolves({ name: "set3" })
      proxyquire("../../../src/setUp/containers/app", { setZoneSet: setMockZoneSet })
      deleteMockZoneSet = sinon.stub(zoneSetsActions, "deleteZoneSet").resolves({ name: "set1" })
      proxyquire("../../../src/setUp/containers/app", { deleteZoneSet: deleteMockZoneSet })
    })

    afterEach(() => {
      getMockZoneSets.restore()
      setMockZoneSet.restore()
      deleteMockZoneSet.restore()
    })

    it("sends expected props to params", done => {
      const zoneSetFields = [{ name: "name", type: "text" }]
      const props = {
        backend,
        title: "ZoneSets:",
        get: getZoneSets,
        set: setZoneSet,
        delete: deleteZoneSet,
        paramName: "zoneSet",
        createText: "Create Zone Set"
      }
      const copyProps = {
        fields: zoneSetFields
      }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zoneSets" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("zoneSets")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zoneSets" })
        sinon.assert.calledTwice(getMockZoneSets)
        sinon.assert.calledWith(getMockZoneSets, { backend })
        done()
      })
    })

    it("when a zone set is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zoneSets" })
        const data = {
          name: "set3"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "zoneSet",
            createText: "Create Zone Set",
            data
          })
          sinon.assert.calledOnce(setMockZoneSet)
          sinon.assert.calledWith(setMockZoneSet, { backend, zoneSet: data })
          done()
        })
      })
    })

    it("when a zoneSet is deleted delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        zoneSet: { name: "set1" }
      }
      app.setState({ show: "zoneSets" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "zoneSet")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteMockZoneSet)
        sinon.assert.calledWith(deleteMockZoneSet, callArgs)
        done()
      })
    })

    it("when a zone is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend }
      app.setState({ show: "zoneSets" })
      setImmediate(() => {
        const dataTable = app.find(Params)
          .filterWhere(params => params.props().paramName === "zoneSet")
          .find(DataTable)
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        setImmediate(() => {
          sinon.assert.calledThrice(getMockZoneSets)
          sinon.assert.alwaysCalledWith(getMockZoneSets, callArgs)
          done()
        })
      })
    })
  })
})