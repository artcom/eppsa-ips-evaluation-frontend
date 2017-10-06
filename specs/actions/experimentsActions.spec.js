import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../src/constants"
import {
  deleteExperiment,
  getExperiments,
  processParams,
  runExperiment,
  setExperiment
} from "../../src/setUp/actions/experimentsActions"


describe("experimentsActions", () => {
  const backend = config.backend

  describe("processParams", () => {
    it("should return processed params", () => {
      const params = { Quuppa: true, GoIndoor: true, repeats: 4, interval: 2 }
      const processedParams = { experimentTypes: ["Quuppa", "GoIndoor"], repeats: 4, interval: 2 }
      expect(isEqual(processParams(params), processedParams)).to.equal(true)
    })
  })

  describe("actions", () => {
    const experiments = [{ name: "fake-experiment1" }]
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../src/setUp/actions/experimentsActions", { rest: { del: delMock } })
      proxyquire("../../src/setUp/actions/experimentsActions", { rest: { get: getMock } })
      proxyquire("../../src/setUp/actions/experimentsActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getExperiments", () => {
      beforeEach(() => {
        getMock.resolves({ data: experiments })
      })

      it("should send a get request to the expected URL", async () => {
        const url = `http://${backend}/experiments`
        await getExperiments({ backend })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getExperiments({ backend })
        expect(isEqual(result, experiments)).to.equal(true)
      })
    })

    describe("setExperiment", () => {
      beforeEach(() => {
        postMock.resolves({ data: experiments[0].name })
      })

      it("should post the expected data to the expected URL", async () => {
        const url = `http://${backend}/experiments`
        const experiment = experiments[0]
        await setExperiment({ backend, experiment })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: experiment })
      })

      it("should return the server response data", async () => {
        const response = experiments[0].name
        const experiment = experiments[0]
        const result = await setExperiment({ backend, experiment })
        expect(result).to.equal(response)
      })
    })

    describe("deleteExperiment", () => {
      beforeEach(() => {
        delMock.resolves({ data: experiments[0].name })
      })

      it("should send a get request to the expected URL", async () => {
        const experimentName = experiments[0].name
        const url = `http://${backend}/experiments/fake-experiment1`
        await deleteExperiment({ backend, experimentName })
        sinon.assert.calledOnce(delMock)
        sinon.assert.calledWith(delMock, url)
      })

      it("should return the server response data", async () => {
        const experiment = experiments[0]
        const response = "fake-experiment1"
        const result = await deleteExperiment({ backend, experiment })
        expect(result).to.equal(response)
      })
    })

    describe("runExperiment", () => {
      beforeEach(() => {
        postMock.resolves({ data: "started Quuppa, GoIndoor experiment" })
      })

      it("should post the expected data to the expected URL", async () => {
        const data = {
          Quuppa: true,
          GoIndoor: true,
          repeats: 4,
          interval: 2
        }
        const runArgs = { backend, experimentName: "fake-experiment1", run: data }
        const postData = { experimentTypes: ["Quuppa", "GoIndoor"], repeats: 4, interval: 2 }
        const url = `http://${backend}/experiments/fake-experiment1/run`
        await runExperiment(runArgs)
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: postData })
      })

      it("should return the server response data", async () => {
        const response = "started Quuppa, GoIndoor experiment"
        const data = {
          Quuppa: true,
          GoIndoor: true,
          repeats: 4,
          interval: 2
        }
        const runArgs = { backend, experimentName: "fake-experiment1", run: data }
        const result = await runExperiment(runArgs)
        expect(result).to.equal(response)
      })
    })
  })
})

