/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../../src/setUp/containers/app"
import config from "../../../../src/constants"
import DataTable from "../../../../src/setUp/components/dataTable"
import experimentsData from "../../../testData/experiments.json"
import Params from "../../../../src/setUp/containers/params"
import nodesData from "../../../testData/nodes.json"
import pointsData from "../../../testData/pointsFrontend.json"
import { addParam } from "../../../helpers/appHelpers"
import { findButtonByName } from "../../../helpers/findElements"
import { getPoints, setPoint } from "../../../../src/setUp/actions/pointsActions"
import { checkProps } from "../../../helpers/propsHelpers"
const experimentsActions = require("../../../../src/shared/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")


describe("App Points", () => {
  const backend = config.backend
  let getExperimentsStub
  let getNodesStub
  let getPointsStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getExperiments: getExperimentsStub }
    )
    getNodesStub = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodes: getNodesStub }
    )
    getPointsStub = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getPoints: getPointsStub }
    )
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getNodesStub.restore()
    getPointsStub.restore()
  })

  describe("contains", () => {
    it("points when show state is \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "points" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "point"))
        .to.have.length(1)
    })

    it("no points when show state is not \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "point"))
        .to.have.length(0)
    })
  })

  describe("when points tab is active", () => {
    let setPointStub
    let deletePointStub

    beforeEach(() => {
      setPointStub = sinon.stub(pointsActions, "setPoint")
        .resolves({
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        })
      proxyquire("../../../../src/setUp/containers/app", { setPoint: setPointStub })
      deletePointStub = sinon.stub(pointsActions, "deletePoint").resolves("point1")
      proxyquire("../../../../src/setUp/containers/app", { deletePoint: deletePointStub })
    })

    afterEach(() => {
      setPointStub.restore()
      deletePointStub.restore()
    })

    it("expected props are sent to params", done => {
      const pointFields = [
        { name: "name", type: "text" },
        { name: "X", type: "text" },
        { name: "Y", type: "text" },
        { name: "Z", type: "text" }
      ]
      const props = {
        backend,
        title: "Points:",
        get: getPoints,
        set: setPoint,
        paramName: "point",
        createText: "Add Point"
      }
      const copyProps = { fields: pointFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("points")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        sinon.assert.calledTwice(getPointsStub)
        sinon.assert.calledWith(getPointsStub, { backend })
        done()
      })
    })

    it("when a point is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "points" })
        sinon.assert.calledTwice(getPointsStub)
        const data = {
          name: "point3",
          X: 4,
          Y: 4,
          Z: 5
        }
        setImmediate(() => {
          addParam({ mountedComponent: app, paramName: "point", createText: "Add Point", data })
          sinon.assert.calledOnce(setPointStub)
          sinon.assert.calledWith(setPointStub, { backend, point: data })
          done()
        })
      })
    })

    it("when a point is deleted, delete function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = {
        backend,
        point: {
          name: "point1",
          X: 1,
          Y: 1,
          Z: 2
        }
      }
      app.setState({ show: "points" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "point")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledOnce(deletePointStub)
        sinon.assert.calledWith(deletePointStub, callArgs)
        done()
      })
    })

    it("when a point is deleted, get function is called", done => {
      const app = mount(<App backend={ backend } />)
      const callArgs = { backend }
      app.setState({ show: "points" })
      const dataTable = app.find(Params)
        .filterWhere(params => params.props().paramName === "point")
        .find(DataTable)
      setImmediate(() => {
        const param1Row = dataTable.find("tbody").find("tr").at(0)
        findButtonByName(param1Row, "Delete").simulate("click")
        sinon.assert.calledTwice(getPointsStub)
        sinon.assert.callOrder(
          getPointsStub.withArgs(callArgs),
          getPointsStub.withArgs(callArgs)
        )
        done()
      })
    })
  })
})
