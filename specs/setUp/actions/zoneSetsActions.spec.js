import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import zoneSets from "../../testData/zoneSets.json"
import { getZoneSets, setZoneSet, deleteZoneSet } from "../../../src/setUp/actions/zoneSetsActions"


describe("nodesActions", () => {
  const backend = config.backend

  describe("actions", () => {
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { del: delMock } })
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { get: getMock } })
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getZones", () => {
      beforeEach(() => {
        getMock.resolves({ data: zoneSets })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets`
        await getZoneSets({ backend })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the zones it got from the backend", async () => {
        const result = await getZoneSets({ backend })
        expect(isEqual(result, zoneSets)).to.equal(true)
      })
    })

    describe("setZoneSet", () => {
      beforeEach(() => {
        postMock.resolves({ data: zoneSets[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/zone-sets`
        const zoneSet = zoneSets[0]
        await setZoneSet({ backend, zoneSet })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: zoneSets[0] })
      })

      it("should return the server response data", async () => {
        const zoneSet = zoneSets[0]
        const result = await setZoneSet({ backend, zoneSet })
        expect(isEqual(result, zoneSets[0].name)).to.equal(true)
      })
    })

    describe("deleteZoneSet", () => {
      beforeEach(() => {
        delMock.resolves({ data: zoneSets[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets/${zoneSets[0].name}`
        const zoneSet = zoneSets[0]
        await deleteZoneSet({ backend, zoneSet })
        sinon.assert.calledOnce(delMock)
        sinon.assert.calledWith(delMock, url)
      })

      it("should return the server response data", async () => {
        const zoneSet = zoneSets[0]
        const result = await deleteZoneSet({ backend, zoneSet })
        expect(isEqual(result, zoneSets[0].name)).to.equal(true)
      })
    })
  })
})
