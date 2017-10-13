import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import config from "../../../src/constants"
import nodes from "../../testData/nodes.json"
import { getNodes, setNode, deleteNode } from "../../../src/setUp/actions/nodesActions"


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
    })

    afterEach(() => {
      delStub.restore()
      getStub.restore()
      postStub.restore()
    })

    describe("getNodes", () => {
      beforeEach(() => {
        getStub.resolves({ data: nodes })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/nodes`
        await getNodes({ backend })
        sinon.assert.calledOnce(getStub)
        sinon.assert.calledWith(getStub, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getNodes({ backend })
        expect(isEqual(result, nodes)).to.equal(true)
      })
    })

    describe("setNode", () => {
      beforeEach(() => {
        postStub.resolves({ data: nodes[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/nodes`
        const node = nodes[0]
        await setNode({ backend, node })
        sinon.assert.calledOnce(postStub)
        sinon.assert.calledWith(postStub, url, { data: nodes[0] })
      })

      it("should return the server response data", async () => {
        const node = nodes[0]
        const result = await setNode({ backend, node })
        expect(isEqual(result, nodes[0].name)).to.equal(true)
      })
    })

    describe("deleteNode", () => {
      beforeEach(() => {
        delStub.resolves({ data: nodes[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/nodes/${nodes[0].name}`
        const node = nodes[0]
        await deleteNode({ backend, node })
        sinon.assert.calledOnce(delStub)
        sinon.assert.calledWith(delStub, url)
      })

      it("should return the server response data", async () => {
        const node = nodes[0]
        const result = await deleteNode({ backend, node })
        expect(isEqual(result, nodes[0].name)).to.equal(true)
      })
    })
  })
})
