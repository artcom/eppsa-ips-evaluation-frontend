import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../src/constants"
import zones from "../testData/zones.json"
import zoneSets from "../testData/zoneSets.json"
import { getZones, setZone, deleteZone } from "../../src/setUp/actions/zonesActions"


describe("zonesActions", () => {
  const backend = config.backend
  const zoneSetName = "set1"

  describe("actions", () => {
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../src/setUp/actions/zonesActions", { rest: { del: delMock } })
      proxyquire("../../src/setUp/actions/zonesActions", { rest: { get: getMock } })
      proxyquire("../../src/setUp/actions/zonesActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getZones", () => {
      beforeEach(() => {
        getMock.resolves({ data: zoneSets[0] })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/zone-sets/${zoneSetName}`
        await getZones({ backend, zoneSetName })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the zones it got from the backend", async () => {
        const result = await getZones({ backend })
        expect(isEqual(result, zones)).to.equal(true)
      })
    })

    describe("setZone", () => {
      beforeEach(() => {
        postMock.onFirstCall().resolves({ data: zones[0].name })
        postMock.onSecondCall().resolves({ data: { zoneSetName, zoneName: zones[0].name } })
      })

      it("should POST the expected data to the expected URL", async () => {
        const zonesUrl = `http://${backend}/zones`
        const zoneSetsUrl = `http://${backend}/zone-sets/${zoneSetName}`
        const zone = zones[0]
        await setZone({ backend, zone, zoneSetName })
        sinon.assert.calledTwice(postMock)
        sinon.assert.callOrder(
          postMock.withArgs(zonesUrl, { data: zones[0] }),
          postMock.withArgs(zoneSetsUrl, { data: { zoneName: zones[0].name } })
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
        delMock.onFirstCall().resolves({ data: { zoneSetName, zoneName: zones[0].name } })
        delMock.onSecondCall().resolves({ data: zones[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const zonesUrl = `http://${backend}/zones/${zones[0].name}`
        const zoneSetsUrl = `http://${backend}/zone-sets/${zoneSetName}/${zones[0].name}`
        const zone = zones[0]
        await deleteZone({ backend, zone, zoneSetName })
        sinon.assert.calledTwice(delMock)
        sinon.assert.callOrder(
          delMock.withArgs(zoneSetsUrl),
          delMock.withArgs(zonesUrl)
        )
        sinon.assert.calledWith(delMock, zonesUrl)
      })

      it("should return the server response data", async () => {
        const zone = zones[0]
        const result = await deleteZone({ backend, zone })
        expect(isEqual(result, { zoneSetName, zoneName: zones[0].name })).to.equal(true)
      })
    })
  })
})
