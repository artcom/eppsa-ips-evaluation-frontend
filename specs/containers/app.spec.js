/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { shallow, mount } from "enzyme"
import App from "../../src/setUp/containers/app"
import { backend } from "../../src/constants"
import experimentsData from "../testData/experiments.json"
import Params from "../../src/setUp/containers/params"
import nodesData from "../testData/nodes.json"
import nodePositionsData from "../testData/nodePositions.json"
import pointsData from "../testData/points.json"
import SelectExperiment from "../../src/setUp/components/selectExperiment"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"
import zonesData from "../testData/zones.json"
import { addParam } from "../helpers/appHelpers"
import { findButtonByName } from "../helpers/findElements"
import { getNodePositions, setNodePosition } from "../../src/setUp/actions/nodePositionsActions"
import { getZones, setZone } from "../../src/setUp/actions/zoneActions"
import { checkProps } from "../helpers/propsHelpers"
const experimentsActions = require("../../src/setUp/actions/experimentsActions")
const nodesActions = require("../../src/setUp/actions/nodesActions")
const nodePositionsActions = require("../../src/setUp/actions/nodePositionsActions")
const pointsActions = require("../../src/setUp/actions/pointsActions")
const zonesActions = require("../../src/setUp/actions/zoneActions")


describe("App", () => {
  let getMockExperiments
  let getMockNodes
  let getMockPoints

  beforeEach(() => {
    getMockExperiments = sinon.stub(experimentsActions, "getExperiments")
      .resolves(experimentsData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getExperiments: getMockExperiments }
    )
    getMockNodes = sinon.stub(nodesActions, "getNodes")
      .resolves(nodesData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getNodes: getMockNodes }
    )
    getMockPoints = sinon.stub(pointsActions, "getPoints")
      .resolves(pointsData)
    proxyquire(
      "../../src/setUp/containers/app",
      { getPoints: getMockPoints }
    )
  })

  afterEach(() => {
    getMockExperiments.restore()
    getMockNodes.restore()
    getMockPoints.restore()
  })

  describe("contains", () => {
    let getMockNodePositions

    beforeEach(() => {
      getMockNodePositions = sinon.stub(nodePositionsActions, "getNodePositions")
        .resolves(nodePositionsData)
      proxyquire(
        "../../src/setUp/containers/app",
        { getNodePositions: { getNodePositions: getMockNodePositions } }
      )
    })

    afterEach(() => {
      getMockNodePositions.restore()
    })

    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("tabs", () => {
      const tabs = ["Experiments", "Points", "Zones", "Nodes", "NodePositions"]
      const app = mount(<App />)
      expect(app.find(TabBar).find(Tab)).to.have.length(tabs.length)
      expect(app.find(TabBar).find(Tab).map(tab => tab.text())).to.deep.equal(tabs)
    })

    it("zones when show state is \"zones\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "zones" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(1)
    })

    it("no zones when show state is not \"zones\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "zone"))
        .to.have.length(0)
    })

    it("nodes when show state is \"nodes\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "nodes" })
      expect(app.find(Params)).to.have.length(1)
      expect(app.find(Params).filterWhere(params => params.props().paramName === "node"))
        .to.have.length(1)
    })

    it("no nodes when show state is not \"nodes\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "node"))
        .to.have.length(0)
    })

    it("node positions when show state is \"nodePositions\" and an experiment is selected",
      done => {
        const app = mount(<App />)
        app.setState({
          show: "nodePositions",
          loaded: true,
          selectedExperiment: "fake-experiment",
          experiments: [{ name: "fake-experiment" }]
        })
        setImmediate(() => {
          sinon.assert.calledTwice(getMockExperiments)
          expect(app.find(Params)).to.have.length(1)
          expect(
            app
              .find(Params)
              .filterWhere(params => params.props().paramName === "nodePosition")
          ).to.have.length(1)
          expect(findButtonByName(app, "Select Other Experiment")).to.have.length(1)
          done()
        })
      }
    )

    it("no node positions when show state is \"nodePositions\" but no experiment is selected",
      () => {
        const app = shallow(<App />)
        app.setState({ show: "nodePositions", loaded: true, selectedExperiment: false })
        expect(app.find(Params).filterWhere(params => params.props().paramName === "nodePosition"))
          .to.have.length(0)
      }
    )

    it("an experiment selection component when show state is \"nodePositions\" but no experiment" +
      " is selected",
      done => {
        const app = shallow(<App />)
        setImmediate(() => {
          app.setState({ show: "nodePositions", loaded: true, selectedExperiment: false })
          expect(app.find(SelectExperiment)).to.have.length(1)
          done()
        })
      }
    )

    it("no node positions when show state is not \"nodePositions\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other", loaded: true })
      expect(app.find(Params).filterWhere(params => params.props().paramName === "nodePosition"))
        .to.have.length(0)
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
        "../../src/setUp/containers/app",
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
        expect(nodesTab.props().highlight).to.equal(true)
        expect(app.state("show")).to.equal("nodePositions")
        done()
      })
    })
  })

  describe("when zones tab is active", () => {
    let getMockZones
    let setMockZone

    beforeEach(() => {
      getMockZones = sinon.stub(zonesActions, "getZones")
        .resolves(zonesData)
      proxyquire(
        "../../src/setUp/containers/app",
        { getZones: getMockZones }
      )
      setMockZone = sinon.stub(zonesActions, "setZone")
        .resolves({
          name: "zone3",
          xMin: 5,
          xMax: 7,
          yMin: 3,
          yMax: 5,
          zMin: 2,
          zMax: 4
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setZone: setMockZone }
      )
    })

    afterEach(() => {
      getMockZones.restore()
      setMockZone.restore()
    })

    it("expected props are sent to params", done => {
      const zoneFields = [
        { name: "name", type: "text" },
        { name: "xMin", type: "text" },
        { name: "xMax", type: "text" },
        { name: "yMin", type: "text" },
        { name: "yMax", type: "text" },
        { name: "zMin", type: "text" },
        { name: "zMax", type: "text" }
      ]
      const props = {
        backend,
        title: "Zones:",
        get: getZones,
        set: setZone,
        paramName: "zone",
        createText: "Add Zone"
      }
      const copyProps = { fields: zoneFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("zones")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
        sinon.assert.calledOnce(getMockZones)
        sinon.assert.calledWith(getMockZones, { backend })
        done()
      })
    })

    it("when a point is added set function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "zones" })
        sinon.assert.calledOnce(getMockZones)
        const data = {
          name: "zone3",
          xMin: 5,
          xMax: 7,
          yMin: 3,
          yMax: 5,
          zMin: 2,
          zMax: 4
        }
        setImmediate(() => {
          addParam({ mountedComponent: app, paramName: "zone", createText: "Add Zone", data })
          sinon.assert.calledOnce(setMockZone)
          sinon.assert.calledWith(setMockZone, { backend, zone: data })
          done()
        })
      })
    })
  })

  describe("when nodePositions tab is active", () => {
    let getMockNodePositions
    let setMockNodePosition

    beforeEach(() => {
      getMockNodePositions = sinon.stub(nodePositionsActions, "getNodePositions")
        .resolves(nodePositionsData)
      proxyquire(
        "../../src/setUp/containers/app",
        { getNodePositions: { getNodePositions: getMockNodePositions } }
      )
      setMockNodePosition = sinon.stub(nodePositionsActions, "setNodePosition")
        .resolves({
          nodeName: "Node3",
          pointName: "point3",
          experimentName: "fake-experiment1"
        })
      proxyquire(
        "../../src/setUp/containers/app",
        { setNodePosition: { setNodePosition: setMockNodePosition } }
      )
    })

    afterEach(() => {
      getMockNodePositions.restore()
      setMockNodePosition.restore()
    })

    it("sends expected props to params", done => {
      const nodePositionsFields = [
        { name: "nodeName", type: "select", options: ["Node1", "Node2"] },
        { name: "pointName", type: "select", options: ["point1", "point2"] },
        { name: "experimentName", type: "text", value: "fake-experiment1", readOnly: true }
      ]
      const props = {
        backend,
        title: "Node Positions for \"fake-experiment1\":",
        get: getNodePositions,
        set: setNodePosition,
        paramName: "nodePosition",
        createText: "Set Node Position in \"fake-experiment1\"",
        experiment: "fake-experiment1"
      }
      const copyProps = { fields: nodePositionsFields }

      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        const params = app.find(Params)

        expect(app.state("show")).to.equal("nodePositions")
        expect(params).to.have.length(1)
        checkProps({ mountedComponent: params, props })
        checkProps({ mountedComponent: params, props: copyProps, copy: true })
        done()
      })
    })

    it("sends expected props to selectExperiment", done => {
      const props = { experiments: experimentsData }
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectExperiment)
        checkProps({ mountedComponent: selectExperiment, props })
        done()
      })
    })

    it("get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledTwice(getMockExperiments)
        sinon.assert.calledWith(getMockExperiments, { backend })
        setImmediate(() => {
          sinon.assert.calledOnce(getMockNodePositions)
          sinon.assert.calledWith(
            getMockNodePositions,
            { backend, experimentName: "fake-experiment1" }
          )
          done()
        })
      })
    })

    it("when an experiment is selected the selected experiment is set in state", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions" })
        const selectExperiment = app.find(SelectExperiment)
        findButtonByName(selectExperiment, "fake-experiment1").simulate("click")
        expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
        done()
      })
    })

    it("sets selectedExperiment state to null when select other experiment button is pushed",
      done => {
        const app = mount(<App backend={ backend } />)
        setImmediate(() => {
          app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
          expect(app.state("selectedExperiment")).to.equal("fake-experiment1")
          findButtonByName(app, "Select Other Experiment").simulate("click")
          expect(app.state("selectedExperiment")).to.equal(null)
          done()
        })
      }
    )

    it("when a node position is added set function is called with the expected arguments", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledOnce(getMockNodePositions)
        const data = {
          nodeName: "Node2",
          pointName: "point2",
          experimentName: "fake-experiment1"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "nodePosition",
            experiment: "fake-experiment1",
            createText: "Set Node Position in \"fake-experiment1\"",
            data
          })
          setImmediate(() => {
            sinon.assert.calledOnce(setMockNodePosition)
            sinon.assert.calledWith(
              setMockNodePosition,
              { backend, experimentName: "fake-experiment1", nodePosition: data }
            )
            done()
          })
        })
      })
    })

    it("when a node position is added get function is called", done => {
      const app = mount(<App backend={ backend } />)
      setImmediate(() => {
        app.setState({ show: "nodePositions", selectedExperiment: "fake-experiment1" })
        sinon.assert.calledOnce(getMockNodePositions)
        const data = {
          nodeName: "Node2",
          pointName: "point2",
          experimentName: "fake-experiment1"
        }
        setImmediate(() => {
          addParam({
            mountedComponent: app,
            paramName: "nodePosition",
            experiment: "fake-experiment1",
            createText: "Set Node Position in \"fake-experiment1\"",
            data
          })
          setImmediate(() => {
            sinon.assert.calledTwice(getMockNodePositions)
            sinon.assert.calledWith(
              getMockNodePositions,
              { backend, experimentName: "fake-experiment1" }
            )
            done()
          })
        })
      })
    })
  })
})
