import { describe, it } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import positionDataGoIndoor from "../../testData/positionDataGoIndoor.json"
import processedPositionData from "../../testData/processedPositionData.json"
import { positionData3D } from "../../../src/analyze/processData"


describe("processData", () => {
  describe("positionData3D", () => {
    it("should return the expected object for 3D surface drawing with plotly", () => {
      const processedData = positionData3D(positionDataGoIndoor)
      expect(isEqual(processedData, processedPositionData)).to.equal(true)
    })
  })
})
