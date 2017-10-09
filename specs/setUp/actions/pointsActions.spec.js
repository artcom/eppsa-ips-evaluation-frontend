import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import pointsFrontend from "../../testData/pointsFrontend.json"
import pointsBackend from "../../testData/pointsBackend.json"
import {
  getPoints,
  setPoint,
  deletePoint,
  processReceivedData,
  processSendData
} from "../../../src/setUp/actions/pointsActions"


describe("pointsActions", () => {
  const backend = config.backend

  describe("processSendData", () => {
    it("should process data to be sent", () => {
      expect(isEqual(processSendData(pointsFrontend[0]), pointsBackend[0])).to.equal(true)
    })
  })

  describe("processReceivedData", () => {
    it("should process received data", () => {
      expect(isEqual(processReceivedData(pointsBackend), pointsFrontend)).to.equal(true)
    })
  })

  describe("actions", () => {
    let delStub
    let getStub
    let postStub

    beforeEach(() => {
      delStub = sinon.stub(rest, "del")
      getStub = sinon.stub(rest, "get")
      postStub = sinon.stub(rest, "post")
      proxyquire("../../../src/setUp/actions/pointsActions", { rest: { del: delStub } })
      proxyquire("../../../src/setUp/actions/pointsActions", { rest: { get: getStub } })
      proxyquire("../../../src/setUp/actions/pointsActions", { rest: { post: postStub } })
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getPoints", () => {
      beforeEach(() => {
        getStub.resolves({ data: pointsBackend })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/points`
        await getPoints({ backend })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getPoints({ backend })
        expect(isEqual(result, pointsFrontend)).to.equal(true)
      })
    })

    describe("setPoint", () => {
      beforeEach(() => {
        postStub.resolves({ data: pointsBackend[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/points`
        const point = pointsFrontend[0]
        await setPoint({ backend, point })
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: pointsBackend[0] })
      })

      it("should return the server response data", async () => {
        const point = pointsFrontend[0]
        const result = await setPoint({ backend, point })
        expect(isEqual(result, pointsBackend[0].name)).to.equal(true)
      })
    })

    describe("deletePoint", () => {
      beforeEach(() => {
        delStub.resolves({ data: pointsBackend[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/points/${pointsBackend[0].name}`
        const point = pointsFrontend[0]
        await deletePoint({ backend, point })
        sinon.assert.calledOnce(delStub)
        sinon.assert.calledWith(delStub, url)
      })

      it("should return the server response data", async () => {
        const point = pointsFrontend[0]
        const result = await deletePoint({ backend, point })
        expect(isEqual(result, pointsBackend[0].name)).to.equal(true)
      })
    })
  })
})
