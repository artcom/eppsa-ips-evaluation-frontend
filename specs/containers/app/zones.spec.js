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
import Params from "../../../src/setUp/containers/params"
import nodesData from "../../testData/nodes.json"
import pointsData from "../../testData/pointsFrontend.json"
import SelectCategory from "../../../src/setUp/components/selectCategory"
import Tab from "../../../src/setUp/components/tab"
import zonesData from "../../testData/zones.json"
import zoneSets from "../../testData/zoneSets.json"
import { addParam } from "../../helpers/appHelpers"
import { findButtonByName } from "../../helpers/findElements"
import { getZones, setZone } from "../../../src/setUp/actions/zonesActions"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")
const zonesActions = require("../../../src/setUp/actions/zonesActions")
const zoneSetsActions = require("../../../src/setUp/actions/zoneSetsActions")


describe("App Zones", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockZoneSets
  let getMockNodes
  let getMockPoints
  let getMockZones

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
    getMockZones = sinon.stub(zonesActions, "getZones")
      .resolves(zonesData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getZones: getMockZones }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockZoneSets.restore()
    getMockNodes.restore()
    getMockPoints.restore()
    getMockZones.restore()
  })

  describe("contains", () => {
    it("zones when show state is \"zones\" and a zone set is selected", done => {
      const app = mount(<App />)
      app.setState({
        show: "zones",
        loaded: true,
        selectedZoneSet: "set1",
        zoneSets: [{ name: "set1" }]
      })
      setImmediate(() => {
        expect(app.find(Params)).to.have.length(1)
        expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
          .to.have.length(1)
      })
      done()
    })

    it("no zones when show state is \"zones\" but no zone set is selected", () => {
      const app = shallow(<App />)
      app.setState({
        show: "zones",
        loaded: true,
        selectedZoneSet: false
      })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(0)
    })

    it("a zone set selection component when show state is \"zones\" but no zone set" +
      " is selected",
      done => {
        const app = shallow(<App />)
        setImmediate(() => {
          app.setState({ show: "zones", loaded: true, selectedZoneSet: false })
          expect(app.find(SelectCategory)).to.have.length(1)
          done()
        })
      }
    )

    it("no zones when show state is not \"zones\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(0)
    })
  })

  describe("when zones tab is active", () => {
    let setMockZone
    let deleteMockZone

    beforeEach(() => {
      setMockZone = sinon.stub(zonesActions, "setZone")
        .resolves({
          name: "zone3",
          xMin: 5,
          xMax: 7,
          yMin: 3,
          yMax: 5,
          zMin: 2,
          zMax: 4
        })
      proxyquire(
        "../../../src/setUp/containers/app",
        { setZone: setMockZone }
      )
      deleteMockZone = sinon.stub(zonesActions, "deleteZone").resolves("zone1")
      proxyquire(
        "../../../src/setUp/containers/app",
        { deleteZone: deleteMockZone }
      )
    })

    afterEach(() => {
      setMockZone.restore()
      deleteMockZone.restore()
    })

    it("expected props are sent to params", done => {
      const zoneFields = [
        { name: "name", type: "text" },
        { name: "xMin", type: "text" },
        { name: "xMax", type: "text" },
        { name: "yMin", type: "text" },
        { name: "yMax", type: "text" },
        { name: "zMin", type: "text" },
        { name: "zMax", type: "text" }
      ]
      const props = {
        backend,
        title: "Zones for set1:",
        get: getZones,
        set: setZone,
        paramName: "zone",
        createText: "Add Zone"
      }
      const copyProps = { fields: zoneFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({
          show: "zones",
          loaded: true,
          selectedZoneSet: "set1" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("zones")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({
          show: "zones",
          loaded: true,
          selectedZoneSet: "set1" })
        sinon.assert.calledOnce(getMockZones)
        sinon.assert.calledWith(getMockZones, { backend, zoneSetName: "set1" })
        done()
      })
    })

    it("getZoneSets is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const zonesTab = app.find(Tab).filterWhere(tab => tab.text() === "Zones")
        zonesTab.simulate("click")
        setImmediate(() => {
          sinon.assert.calledTwice(getMockZoneSets)
          done()
        })
      })
    })

    it("when a zone set is selected it is set in state", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
        const selectZoneSet = app.find(SelectCategory)
        findButtonByName(selectZoneSet, "set1").simulate("click")
        expect(app.state("selectedZoneSet")).to.equal("set1")
        done()
      })
    })

    it("sets selectedZoneSet state to null when select other zone set button is pushed",
      done => {
        const app = mount(<App backend={ backend } />)
        setImmediate(() => {
          app.setState({ show: "zones", selectedZoneSet: "set1" })
          expect(app.state("selectedZoneSet")).to.equal("set1")
          findButtonByName(app, "Select Other Zone Set").simulate("click")
          expect(app.state("selectedZoneSet")).to.equal(null)
          done()
        })
      }
    )

    it("when a zone is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({
          show: "zones",
          loaded: true,
          selectedZoneSet: "set1" })
        sinon.assert.calledOnce(getMockZones)
        const data = {
          name: "zone3",
          xMin: 5,
          xMax: 7,
          yMin: 3,
          yMax: 5,
          zMin: 2,
          zMax: 4
        }
        setImmediate(() => {
          addParam({ mountedComponent: app, paramName: "zone", createText: "Add Zone", data })
          sinon.assert.calledOnce(setMockZone)
          sinon.assert.calledWith(setMockZone, { backend, zone: data, zoneSetName: "set1" })
          done()
        })
      })
    })

    it("when a zone is deleted delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        zone: {
          name: "zone1",
          xMin: 2,
          xMax: 4,
          yMin: 2,
          yMax: 5,
          zMin: 1,
          zMax: 4
        },
        zoneSetName: "set1"
      }
      app.setState({
        show: "zones",
        loaded: true,
        selectedZoneSet: "set1" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "zone")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deleteMockZone)
        sinon.assert.calledWith(deleteMockZone, callArgs)
        done()
      })
    })

    it("when a zone is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend, zoneSetName: "set1" }
      app.setState({
        show: "zones",
        loaded: true,
        selectedZoneSet: "set1" })
      setImmediate(() => {
        const dataTable = app.find(Params)
          .filterWhere(params => params.props().paramName === "zone")
          .find(DataTable)
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        setImmediate(() => {
          sinon.assert.calledTwice(getMockZones)
          sinon.assert.alwaysCalledWith(getMockZones, callArgs)
          done()
        })
      })
    })
  })
})
