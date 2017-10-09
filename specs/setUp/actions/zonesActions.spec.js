import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import zones from "../../testData/zones.json"
import zoneSets from "../../testData/zoneSets.json"
import { getZones, setZone, deleteZone } from "../../../src/setUp/actions/zonesActions"


describe("zonesActions", () => {
  const backend = config.backend
  const zoneSetName = "set1"

  describe("actions", () => {
    let delStub
    let getStub
    let postStub

    beforeEach(() => {
      delStub = sinon.stub(rest, "del")
      getStub = sinon.stub(rest, "get")
      postStub = sinon.stub(rest, "post")
      proxyquire("../../../src/setUp/actions/zonesActions", { rest: { del: delStub } })
      proxyquire("../../../src/setUp/actions/zonesActions", { rest: { get: getStub } })
      proxyquire("../../../src/setUp/actions/zonesActions", { rest: { post: postStub } })
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getZones", () => {
      beforeEach(() => {
        getStub.resolves({ data: zoneSets[0] })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets/${zoneSetName}`
        await getZones({ backend, zoneSetName })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the zones it got from the backend", async () => {
        const result = await getZones({ backend })
        expect(isEqual(result, zones)).to.equal(true)
      })
    })

    describe("setZone", () => {
      beforeEach(() => {
        postStub.onFirstCall().resolves({ data: zones[0].name })
        postStub.onSecondCall().resolves({ data: { zoneSetName, zoneName: zones[0].name } })
      })

      it("should POST the expected data to the expected URL", async () => {
        const zonesUrl = `http://${backend}/zones`
        const zoneSetsUrl = `http://${backend}/zone-sets/${zoneSetName}`
        const zone = zones[0]
        await setZone({ backend, zone, zoneSetName })
        sinon.assert.calledTwice(postStub)
        sinon.assert.callOrder(
          postStub.withArgs(zonesUrl, { data: zones[0] }),
          postStub.withArgs(zoneSetsUrl, { data: { zoneName: zones[0].name } })
        )
      })

      it("should return the server response data", async () => {
        const zone = zones[0]
        const result = await setZone({ backend, zone, zoneSetName })
        expect(isEqual(result, { zoneSetName, zoneName: zones[0].name })).to.equal(true)
      })
    })

    describe("deleteZone", () => {
      beforeEach(() => {
        delStub.onFirstCall().resolves({ data: { zoneSetName, zoneName: zones[0].name } })
        delStub.onSecondCall().resolves({ data: zones[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const zonesUrl = `http://${backend}/zones/${zones[0].name}`
        const zoneSetsUrl = `http://${backend}/zone-sets/${zoneSetName}/${zones[0].name}`
        const zone = zones[0]
        await deleteZone({ backend, zone, zoneSetName })
        sinon.assert.calledTwice(delStub)
        sinon.assert.callOrder(
          delStub.withArgs(zoneSetsUrl),
          delStub.withArgs(zonesUrl)
        )
        sinon.assert.calledWith(delStub, zonesUrl)
      })

      it("should return the server response data", async () => {
        const zone = zones[0]
        const result = await deleteZone({ backend, zone })
        expect(isEqual(result, { zoneSetName, zoneName: zones[0].name })).to.equal(true)
      })
    })
  })
})
