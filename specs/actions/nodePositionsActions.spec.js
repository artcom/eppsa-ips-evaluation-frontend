import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import nodePositionsBackend from "../testData/nodePositionsBackend.json"
import nodePositionsFrontend from "../testData/nodePositionsFrontend.json"
import {
  getNodePositions,
  setNodePosition,
  processReceivedData,
  processSendData
} from "../../src/setUp/actions/nodePositionsActions"


describe("nodesActions", () => {
  describe("processSendData", () => {
    it("should process data to be sent", () => {
      expect(isEqual(processSendData(nodePositionsFrontend[0]), nodePositionsBackend[0]))
        .to.equal(true)
    })
  })

  describe("processREceivedData", () => {
    it("should process received data", () => {
      expect(isEqual(processReceivedData(nodePositionsBackend), nodePositionsFrontend))
        .to.equal(true)
    })
  })

  describe("actions", () => {
    const experimentName = "fake-experiment"
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../src/setUp/actions/nodePositionsActions", { rest: { del: delMock } })
      proxyquire("../../src/setUp/actions/nodePositionsActions", { rest: { get: getMock } })
      proxyquire("../../src/setUp/actions/nodePositionsActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getNodePositions", () => {
      beforeEach(() => {
        getMock.resolves({ data: nodePositionsBackend })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/experiments/${experimentName}/node-positions`
        await getNodePositions({ backend, experimentName })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getNodePositions({ backend, experimentName })
        expect(isEqual(result, nodePositionsFrontend))
      })
    })

    describe("setNodePositions", () => {
      beforeEach(() => {
        postMock.resolves({ data: nodePositionsBackend[0].localizedNodeName })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/experiments/${experimentName}/node-positions`
        const nodePosition = nodePositionsFrontend[0]
        await setNodePosition({ backend, experimentName, nodePosition })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: nodePositionsBackend[0] })
      })

      it("should return the server response data", async () => {
        const nodePosition = nodePositionsFrontend[0]
        const result = await setNodePosition({ backend, experimentName, nodePosition })
        expect(isEqual(result, nodePositionsFrontend[0].localizedNodeName))
      })
    })
  })
})
