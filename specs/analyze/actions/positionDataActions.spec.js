import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import positionData from "../../testData/positionData.json"
import { getPositionData } from "../../../src/analyze/actions/positionDataActions"


describe("positionDataActions", () => {
  const backend = config.backend
  const experimentName = "test-experiment"

  let getMock

  beforeEach(() => {
    getMock = sinon.stub(rest, "get")
    proxyquire("../../../src/analyze/actions/positionDataActions", { rest: { get: getMock } })
  })

  afterEach(() => {
    getMock.restore()
  })

  describe("getPositionData", () => {
    beforeEach(() => {
      getMock.resolves({ data: positionData })
    })

    it("should send a GET request to the expected URL", async () => {
      const url = `http://${backend}/experiments/${experimentName}/position-data`
      await getPositionData({ backend, experimentName })
      sinon.assert.calledOnce(getMock)
      sinon.assert.calledWith(getMock, url)
    })

    it("should return the experiments it got from the backend", async () => {
      const result = await getPositionData({ backend, experimentName })
      expect(isEqual(result, positionData)).to.equal(true)
    })
  })
})
