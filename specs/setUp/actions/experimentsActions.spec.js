import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import config from "../../../src/constants"
import {
  deleteExperiment,
  getExperiments,
  processParams,
  runExperiment,
  setExperiment
} from "../../../src/shared/actions/experimentsActions"


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
    let delStub
    let getStub
    let postStub

    beforeEach(() => {
      delStub = sinon.stub(rest, "del")
      getStub = sinon.stub(rest, "get")
      postStub = sinon.stub(rest, "post")
      proxyquire("../../../src/shared/actions/experimentsActions", { rest: { del: delStub } })
      proxyquire("../../../src/shared/actions/experimentsActions", { rest: { get: getStub } })
      proxyquire("../../../src/shared/actions/experimentsActions", { rest: { post: postStub } })
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getExperiments", () => {
      beforeEach(() => {
        getStub.resolves({ data: experiments })
      })

      it("should send a get request to the expected URL", async () => {
        const url = `http://${backend}/experiments`
        await getExperiments({ backend })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getExperiments({ backend })
        expect(isEqual(result, experiments)).to.equal(true)
      })
    })

    describe("setExperiment", () => {
      beforeEach(() => {
        postStub.resolves({ data: experiments[0].name })
      })

      it("should post the expected data to the expected URL", async () => {
        const url = `http://${backend}/experiments`
        const experiment = experiments[0]
        await setExperiment({ backend, experiment })
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: experiment })
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
        delStub.resolves({ data: experiments[0].name })
      })

      it("should send a get request to the expected URL", async () => {
        const experimentName = experiments[0].name
        const url = `http://${backend}/experiments/fake-experiment1`
        await deleteExperiment({ backend, experimentName })
        sinon.assert.calledOnce(delStub)
        sinon.assert.calledWith(delStub, url)
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
        postStub.resolves({ data: "started Quuppa, GoIndoor experiment" })
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
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: postData })
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

