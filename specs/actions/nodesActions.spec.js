import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { isEqual } from "lodash"
import rest from "restling"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import nodes from "../testData/nodes.json"
import { getNodes, setNode, deleteNode } from "../../src/setUp/actions/nodesActions"


describe("nodesActions", () => {
  describe("actions", () => {
    let delMock
    let getMock
    let postMock

    beforeEach(() => {
      delMock = sinon.stub(rest, "del")
      getMock = sinon.stub(rest, "get")
      postMock = sinon.stub(rest, "post")
      proxyquire("../../src/setUp/actions/nodesActions", { rest: { del: delMock } })
      proxyquire("../../src/setUp/actions/nodesActions", { rest: { get: getMock } })
      proxyquire("../../src/setUp/actions/nodesActions", { rest: { post: postMock } })
    })

    afterEach(() => {
      delMock.restore()
      getMock.restore()
      postMock.restore()
    })

    describe("getNodes", () => {
      beforeEach(() => {
        getMock.resolves({ data: nodes })
      })

      it("should send a GET request to the expected URL", async () => {
        const url = `http://${backend}/nodes`
        await getNodes({ backend })
        sinon.assert.calledOnce(getMock)
        sinon.assert.calledWith(getMock, url)
      })

      it("should return the experiments it got from the backend", async () => {
        const result = await getNodes({ backend })
        expect(isEqual(result, nodes)).to.equal(true)
      })
    })

    describe("setNode", () => {
      beforeEach(() => {
        postMock.resolves({ data: nodes[0].name })
      })

      it("should POST the expected data to the expected URL", async () => {
        const url = `http://${backend}/nodes`
        const node = nodes[0]
        await setNode({ backend, node })
        sinon.assert.calledOnce(postMock)
        sinon.assert.calledWith(postMock, url, { data: nodes[0] })
      })

      it("should return the server response data", async () => {
        const node = nodes[0]
        const result = await setNode({ backend, node })
        expect(isEqual(result, nodes[0].name)).to.equal(true)
      })
    })

    describe("deleteNode", () => {
      beforeEach(() => {
        delMock.resolves({ data: nodes[0].name })
      })

      it("should send a DELETE request to the expected URL", async () => {
        const url = `http://${backend}/nodes/${nodes[0].name}`
        const node = nodes[0]
        await deleteNode({ backend, node })
        sinon.assert.calledOnce(delMock)
        sinon.assert.calledWith(delMock, url)
      })

      it("should return the server response data", async () => {
        const node = nodes[0]
        const result = await deleteNode({ backend, node })
        expect(isEqual(result, nodes[0].name)).to.equal(true)
      })
    })
  })
})
