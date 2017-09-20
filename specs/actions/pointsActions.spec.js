import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import pointsFrontend from "../testData/pointsFrontend.json"
import pointsBackend from "../testData/pointsBackend.json"
import {
  getPoints,
  setPoint,
  deletePoint,
  processReceivedData,
  processSendData
} from "../../src/setUp/actions/pointsActions"


describe("pointsActions", () => {
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
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../src/setUp/actions/pointsActions", { rest: { del: delMock } })
      proxyquire("../../src/setUp/actions/pointsActions", { rest: { get: getMock } })
      proxyquire("../../src/setUp/actions/pointsActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getPoints", () => {
      beforeEach(() => {
        getMock.resolves({ data: pointsBackend })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/points`
        await getPoints({ backend })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getPoints({ backend })
        expect(isEqual(result, pointsFrontend))
      })
    })

    describe("setPoint", () => {
      beforeEach(() => {
        postMock.resolves({ data: pointsBackend[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/points`
        const point = pointsFrontend[0]
        await setPoint({ backend, point })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: pointsBackend[0] })
      })

      it("should return the server response data", async () => {
        const point = pointsFrontend[0]
        const result = await setPoint({ backend, point })
        expect(isEqual(result, pointsBackend[0].name))
      })
    })

    describe("deletePoint", () => {
      beforeEach(() => {
        delMock.resolves({ data: pointsBackend[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/points/${pointsBackend[0].name}`
        const point = pointsFrontend[0]
        await deletePoint({ backend, point })
        sinon.assert.calledOnce(delMock)
        sinon.assert.calledWith(delMock, url)
      })

      it("should return the server response data", async () => {
        const point = pointsFrontend[0]
        const result = await deletePoint({ backend, point })
        expect(isEqual(result, pointsBackend[0].name))
      })
    })
  })
})
