/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../src/setUp/containers/app"
import config from "../../../src/constants"
import experimentsData from "../../testData/experiments.json"
import nodesData from "../../testData/nodes.json"
import pointsData from "../../testData/pointsFrontend.json"
import Tab from "../../../src/setUp/components/tab"
import TabBar from "../../../src/setUp/components/tabBar"
const experimentsActions = require("../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../src/setUp/actions/pointsActions")


describe("App", () => {
  const backend = config.backend
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("tabs", () => {
      const tabs = ["Experiments", "Points", "Zones", "Nodes", "NodePositions", "Run"]
      const app = mount(<App />)
      expect(app.find(TabBar).find(Tab)).to.have.length(tabs.length)
      expect(app.find(TabBar).find(Tab).map(tab => tab.text())).to.deep.equal(tabs)
    })
  })

  describe("loads", () => {
    it("experiments into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledTwice(getMockExperiments)
      setImmediate(() => {
        expect(app.state("experiments")).to.deep.equal(experimentsData)
        done()
      })
    })

    it("nodes into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getMockNodes)
      setImmediate(() => {
        expect(app.state("nodes")).to.deep.equal(nodesData)
        done()
      })
    })

    it("points into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getMockPoints)
      setImmediate(() => {
        expect(app.state("points")).to.deep.equal(pointsData)
        done()
      })
    })
  })

  describe("activates", () => {
    let setMockExperiment

    beforeEach(() => {
      setMockExperiment = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../../src/setUp/containers/app",
        { setExperiment: setMockExperiment }
      )
    })

    afterEach(() => {
      setMockExperiment.restore()
    })

    it("Points when points tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "Points")
        pointsTab.simulate("click")
        expect(pointsTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("points")
        done()
      })
    })

    it("Zones when zones tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "Zones")
        pointsTab.simulate("click")
        expect(pointsTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("zones")
        done()
      })
    })

    it("Nodes when nodes tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "Nodes")
        nodesTab.simulate("click")
        expect(nodesTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("nodes")
        done()
      })
    })

    it("NodePositions when nodePositions tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "NodePositions")
        nodesTab.simulate("click")
        setImmediate(() => {
          expect(nodesTab.props().highlight).to.equal(true)
          expect(app.state("show")).to.equal("nodePositions")
          done()
        })
      })
    })

    it("Run when run tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "Run")
        nodesTab.simulate("click")
        setImmediate(() => {
          expect(nodesTab.props().highlight).to.equal(true)
          expect(app.state("show")).to.equal("run")
          done()
        })
      })
    })
  })
})
