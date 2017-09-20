import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import {
  getPoints,
  setPoint,
  deletePoint,
  processReceivedData,
  processSendData
} from "../../src/setUp/actions/pointsActions"


describe("pointsActions", () => {
  const backendPoints = [
    { name: "point1", trueCoordinateX: 2, trueCoordinateY: 3, trueCoordinateZ: 0 }
  ]
  const frontendPoints = [
    { name: "point1", X: 2, Y: 3, Z: 0 }
  ]
  describe("processSendData", () => {
    it("should process data to be sent", () => {
      expect(isEqual(processSendData(frontendPoints[0]), backendPoints[0])).to.equal(true)
    })
  })

  describe("processReceiveData", () => {
    it("should process data to be sent", () => {
      expect(isEqual(processReceivedData(backendPoints), frontendPoints)).to.equal(true)
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
        getMock.resolves({ data: backendPoints })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/points`
        await getPoints({ backend })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getPoints({ backend })
        expect(isEqual(result, frontendPoints))
      })
    })

    describe("setPoint", () => {
      beforeEach(() => {
        postMock.resolves({ data: backendPoints[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/points`
        const point = frontendPoints[0]
        await setPoint({ backend, point })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: backendPoints[0] })
      })

      it("should return the server response data", async () => {
        const point = frontendPoints[0]
        const result = await setPoint({ backend, point })
        expect(isEqual(result, backendPoints[0].name))
      })
    })

    describe("deletePoint", () => {
      beforeEach(() => {
        delMock.resolves({ data: backendPoints[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/points/${backendPoints[0].name}`
        const point = frontendPoints[0]
        await deletePoint({ backend, point })
        sinon.assert.calledOnce(delMock)
        sinon.assert.calledWith(delMock, url)
      })

      it("should return the server response data", async () => {
        const point = frontendPoints[0]
        const result = await deletePoint({ backend, point })
        expect(isEqual(result, backendPoints[0].name))
      })
    })
  })
})
