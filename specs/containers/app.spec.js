import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import App from "../../src/setUp/containers/app"
import Experiments from "../../src/setUp/containers/experiments"
import Nodes from "../../src/setUp/containers/nodes"
import Points from "../../src/setUp/containers/points"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"


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
})
