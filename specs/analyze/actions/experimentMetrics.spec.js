import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import config from "../../../src/constants"
import experimentMetrics from "../../testData/experimentMetrics.json"
import { getExperimentMetrics } from "../../../src/analyze/actions/experimentMetricsActions"


describe("experimentMetricsActions", () => {
  const backend = config.backend
  const experimentName = "test-experiment"

  let getMock

  beforeEach(() => {
    getMock = sinon.stub(rest, "get")
  })

  afterEach(() => {
    getMock.restore()
  })

  describe("getExperimentMetrics", () => {
    beforeEach(() => {
      getMock.resolves({ data: experimentMetrics })
    })

    it("should send a GET request to the expected URL", async () => {
      const url = `http://${backend}/experiments/${experimentName}/primary-metrics`
      await getExperimentMetrics({ backend, experimentName })
      sinon.assert.calledOnce(getMock)
      sinon.assert.calledWith(getMock, url)
    })

    it("should return the experiments it got from the backend", async () => {
      const result = await getExperimentMetrics({ backend, experimentName })
      expect(isEqual(result, experimentMetrics)).to.equal(true)
    })
  })
})
