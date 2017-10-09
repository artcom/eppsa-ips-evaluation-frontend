/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../../../src/setUp/containers/app"
import config from "../../../../src/constants"
import experimentsData from "../../../testData/experiments.json"
import nodesData from "../../../testData/nodes.json"
import pointsData from "../../../testData/pointsFrontend.json"
import Tab from "../../../../src/setUp/components/tab"
import TabBar from "../../../../src/setUp/components/tabBar"
import zoneSets from "../../../testData/zoneSets.json"
const experimentsActions = require("../../../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../../../src/setUp/actions/nodesActions")
const pointsActions = require("../../../../src/setUp/actions/pointsActions")
const zoneSetsActions = require("../../../../src/setUp/actions/zoneSetsActions")


describe("App", () => {
  const backend = config.backend
  let getExperimentsStub
  let getZoneSetsStub
  let getNodesStub
  let getPointsStub

  beforeEach(() => {
    getExperimentsStub = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getExperiments: getExperimentsStub }
    )
    getZoneSetsStub = sinon.stub(zoneSetsActions, "getZoneSets").resolves(zoneSets)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getZoneSets: getZoneSetsStub }
    )
    getNodesStub = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getNodes: getNodesStub }
    )
    getPointsStub = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../../../src/setUp/containers/app",
      { getPoints: getPointsStub }
    )
  })

  afterEach(() => {
    getExperimentsStub.restore()
    getZoneSetsStub.restore()
    getNodesStub.restore()
    getPointsStub.restore()
  })

  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("tabs", () => {
      const tabs = ["Experiments", "Points", "ZoneSets", "Zones", "Nodes", "NodePositions", "Run"]
      const app = mount(<App />)
      expect(app.find(TabBar).find(Tab)).to.have.length(tabs.length)
      expect(app.find(TabBar).find(Tab).map(tab => tab.text())).to.deep.equal(tabs)
    })
  })

  describe("loads", () => {
    it("experiments into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledTwice(getExperimentsStub)
      setImmediate(() => {
        expect(app.state("experiments")).to.deep.equal(experimentsData)
        done()
      })
    })

    it("nodes into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getNodesStub)
      setImmediate(() => {
        expect(app.state("nodes")).to.deep.equal(nodesData)
        done()
      })
    })

    it("points into state on mount", done => {
      const app = mount(<App backend={ backend } />)
      sinon.assert.calledOnce(getPointsStub)
      setImmediate(() => {
        expect(app.state("points")).to.deep.equal(pointsData)
        done()
      })
    })
  })

  describe("activates", () => {
    let setExperimentStub

    beforeEach(() => {
      setExperimentStub = sinon.stub(experimentsActions, "setExperiment")
        .resolves({
          name: "fake-experiment3"
        })
      proxyquire(
        "../../../../src/setUp/containers/app",
        { setExperiment: setExperimentStub }
      )
    })

    afterEach(() => {
      setExperimentStub.restore()
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
        const zonesTab = app.find(Tab).filterWhere(tab => tab.text() === "Zones")
        zonesTab.simulate("click")
        setImmediate(() => {
          expect(zonesTab.props().highlight).to.equal(true)
          expect(app.state("show")).to.equal("zones")
          done()
        })
      })
    })

    it("ZoneSets when zoneSets tab is clicked", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        expect(app.state("show")).to.equal("experiments")
        const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "ZoneSets")
        pointsTab.simulate("click")
        expect(pointsTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("zoneSets")
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
