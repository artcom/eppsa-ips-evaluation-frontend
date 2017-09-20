/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/setUp/containers/app"
import { backend } from "../../../src/constants"
import DataTable from "../../../src/setUp/components/dataTable"
import experimentsData from "../../testData/experiments.json"
import Params from "../../../src/setUp/containers/params"
import nodesData from "../../testData/nodes.json"
import pointsData from "../../testData/pointsFrontend.json"
import zonesData from "../../testData/zones.json"
import { addParam } from "../../helpers/appHelpers"
import { findButtonByName } from "../../helpers/findElements"
import { getZones, setZone } from "../../../src/setUp/actions/zoneActions"
import { checkProps } from "../../helpers/propsHelpers"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")
const zonesActions = require("../../../src/setUp/actions/zoneActions")


describe("App Zones", () => {
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
    it("zones when show state is \"zones\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "zones" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(1)
    })

    it("no zones when show state is not \"zones\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(0)
    })
  })

  describe("when zones tab is active", () => {
    let getMockZones
    let setMockZone
    let deleteMockZone

    beforeEach(() => {
      getMockZones = sinon.stub(zonesActions, "getZones")
        .resolves(zonesData)
      proxyquire(
        "../../../src/setUp/containers/app",
        { getZones: getMockZones }
      )
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
    })

    afterEach(() => {
      getMockZones.restore()
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
        title: "Zones:",
        get: getZones,
        set: setZone,
        paramName: "zone",
        createText: "Add Zone"
      }
      const copyProps = { fields: zoneFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
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
        app.setState({ show: "zones" })
        sinon.assert.calledOnce(getMockZones)
        sinon.assert.calledWith(getMockZones, { backend })
        done()
      })
    })

    it("when a point is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
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
          sinon.assert.calledWith(setMockZone, { backend, zone: data })
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
        }
      }
      app.setState({ show: "zones" })
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
  })
})
