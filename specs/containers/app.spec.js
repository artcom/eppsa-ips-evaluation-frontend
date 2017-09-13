import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import App from "../../src/setUp/containers/app"
import { backend } from "../../src/constants"
import Experiments from "../../src/setUp/containers/params"
import Nodes from "../../src/setUp/containers/nodes"
import Points from "../../src/setUp/containers/points"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"
import {
  deleteExperiment,
  getExperiments,
  setExperiment
} from "../../src/setUp/actions/experimentsActions"


describe("App", () => {
  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("experiments when show state is \"experiments\"", () => {
      const app = shallow(<App />)
      expect(app.state("show")).to.equal("experiments")
      expect(app.find(Experiments)).to.have.length(1)
    })

    it("no experiments when show state is not \"experiments\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Experiments)).to.have.length(0)
    })

    it("points when show state is \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "points" })
      expect(app.find(Points)).to.have.length(1)
    })

    it("no points when show state is not \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Points)).to.have.length(0)
    })

    it("nodes when show state is \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "nodes" })
      expect(app.find(Nodes)).to.have.length(1)
    })

    it("no nodes when show state is not \"points\"", () => {
      const app = shallow(<App />)
      app.setState({ show: "other" })
      expect(app.find(Nodes)).to.have.length(0)
    })
  })

  describe("activates", () => {
    it("Points when points tab is clicked", () => {
      const app = mount(<App />)
      expect(app.state("show")).to.equal("experiments")
      const pointsTab = app.find(Tab).filterWhere(tab => tab.text() === "Points")
      pointsTab.simulate("click")
      expect(pointsTab.props().highlight).to.equal(true)
      expect(app.state("show")).to.equal("points")
    })

    it("Nodes when nodes tab is clicked", () => {
      const app = mount(<App />)
      expect(app.state("show")).to.equal("experiments")
      const nodesTab = app.find(Tab).filterWhere(tab => tab.text() === "Nodes")
      nodesTab.simulate("click")
      expect(nodesTab.props().highlight).to.equal(true)
      expect(app.state("show")).to.equal("nodes")
    })
  })

  describe("when experiments tab is active", () => {
    it("sends expected props to experiments", () => {
      const app = mount(<App backend={ backend } />)
      app.setState({ show: "experiments" })
      expect(app.state("show")).to.equal("experiments")
      expect(app.find(Experiments)).to.have.length(1)
      expect(app.find(Experiments).props().backend).to.equal(backend)
      expect(app.find(Experiments).props().title).to.equal("Experiments:")
      expect(JSON.stringify(app.find(Experiments).props().fields))
        .to.deep.equal(JSON.stringify([{ name: "name", type: "text" }]))
      expect(app.find(Experiments).props().get).to.equal(getExperiments)
      expect(app.find(Experiments).props().set).to.equal(setExperiment)
      expect(app.find(Experiments).props().delete).to.equal(deleteExperiment)
      expect(app.find(Experiments).props().paramName).to.equal("experiment")
      expect(app.find(Experiments).props().createText).to.equal("Create Experiment")
    })
  })
})
