import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import nodePositionsBackend from "../../testData/nodePositionsBackend.json"
import nodePositionsFrontend from "../../testData/nodePositionsFrontend.json"
import {
  getNodePositions,
  setNodePosition,
  deleteNodePosition,
  processReceivedData,
  processSendData
} from "../../../src/setUp/actions/nodePositionsActions"


describe("nodesActions", () => {
  const backend = config.backend

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
    let delStub
    let getStub
    let postStub

    beforeEach(() => {
      delStub = sinon.stub(rest, "del")
      getStub = sinon.stub(rest, "get")
      postStub = sinon.stub(rest, "post")
      proxyquire("../../../src/setUp/actions/nodePositionsActions", { rest: { del: delStub } })
      proxyquire("../../../src/setUp/actions/nodePositionsActions", { rest: { get: getStub } })
      proxyquire("../../../src/setUp/actions/nodePositionsActions", { rest: { post: postStub } })
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getNodePositions", () => {
      beforeEach(() => {
        getStub.resolves({ data: nodePositionsBackend })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/experiments/${experimentName}/node-positions`
        await getNodePositions({ backend, experimentName })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getNodePositions({ backend, experimentName })
        expect(isEqual(result, nodePositionsFrontend)).to.equal(true)
      })
    })

    describe("setNodePositions", () => {
      beforeEach(() => {
        postStub.resolves({ data: nodePositionsBackend[0].localizedNodeName })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/experiments/${experimentName}/node-positions`
        const nodePosition = nodePositionsFrontend[0]
        await setNodePosition({ backend, experimentName, nodePosition })
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: nodePositionsBackend[0] })
      })

      it("should return the server response data", async () => {
        const nodePosition = nodePositionsFrontend[0]
        const result = await setNodePosition({ backend, experimentName, nodePosition })
        expect(isEqual(result, nodePositionsBackend[0].localizedNodeName)).to.equal(true)
      })
    })

    describe("deleteNodePosition", () => {
      beforeEach(() => {
        delStub.resolves({ data: nodePositionsBackend[0].localizedNodeName })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${
          backend
        }/experiments/${
          experimentName
        }/node-positions/${
          nodePositionsBackend[0].localizedNodeName
        }`
        const nodePosition = nodePositionsFrontend[0]
        await deleteNodePosition({ backend, experimentName, nodePosition })
        sinon.assert.calledOnce(delStub)
        sinon.assert.calledWith(delStub, url)
      })

      it("should return the server response data", async () => {
        const nodePosition = nodePositionsFrontend[0]
        const result = await deleteNodePosition({ backend, experimentName, nodePosition })
        expect(isEqual(result, nodePositionsBackend[0].localizedNodeName)).to.equal(true)
      })
    })
  })
})
