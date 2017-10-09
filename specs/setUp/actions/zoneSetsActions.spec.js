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
    let delStub
    let getStub
    let postStub

    beforeEach(() => {
      delStub = sinon.stub(rest, "del")
      getStub = sinon.stub(rest, "get")
      postStub = sinon.stub(rest, "post")
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { del: delStub } })
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { get: getStub } })
      proxyquire("../../../src/setUp/actions/zoneSetsActions", { rest: { post: postStub } })
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getZones", () => {
      beforeEach(() => {
        getStub.resolves({ data: zoneSets })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets`
        await getZoneSets({ backend })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the zones it got from the backend", async () => {
        const result = await getZoneSets({ backend })
        expect(isEqual(result, zoneSets)).to.equal(true)
      })
    })

    describe("setZoneSet", () => {
      beforeEach(() => {
        postStub.resolves({ data: zoneSets[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/zone-sets`
        const zoneSet = zoneSets[0]
        await setZoneSet({ backend, zoneSet })
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: zoneSets[0] })
      })

      it("should return the server response data", async () => {
        const zoneSet = zoneSets[0]
        const result = await setZoneSet({ backend, zoneSet })
        expect(isEqual(result, zoneSets[0].name)).to.equal(true)
      })
    })

    describe("deleteZoneSet", () => {
      beforeEach(() => {
        delStub.resolves({ data: zoneSets[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets/${zoneSets[0].name}`
        const zoneSet = zoneSets[0]
        await deleteZoneSet({ backend, zoneSet })
        sinon.assert.calledOnce(delStub)
        sinon.assert.calledWith(delStub, url)
      })

      it("should return the server response data", async () => {
        const zoneSet = zoneSets[0]
        const result = await deleteZoneSet({ backend, zoneSet })
        expect(isEqual(result, zoneSets[0].name)).to.equal(true)
      })
    })
  })
})
