import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"


describe("TabBar", () => {
  describe("contains", () => {
    it("an experiments tab", () => {
      const tabs = ["experiments"]
      const app = shallow(<TabBar tabs={ tabs } />)
      expect(app.find(Tab).findWhere(tab => tab.childAt(0).text() === "Experiments"))
        .to.have.length(1)
    })

    it("a points tab", () => {
      const tabs = ["experiments", "points"]
      const app = shallow(<TabBar tabs={ tabs } />)
      expect(app.find(Tab).at(0).childAt(0).text()).to.equal("Experiments")
      expect(app.find(Tab).at(1).childAt(0).text()).to.equal("Points")
    })

    describe("highlights", () => {
      it("the expected tab", () => {
        const tabs = ["experiments", "points"]
        const app = shallow(<TabBar tabs={ tabs } highLight="points" />)
        const experimentsTab = app
          .find(Tab)
          .findWhere(tab => tab.childAt(0).text() === "Experiments")
        const pointsTab = app
          .find(Tab)
          .findWhere(tab => tab.childAt(0).text() === "Points")
        expect(experimentsTab.props().highlight).to.equal(false)
        expect(pointsTab.props().highlight).to.equal(true)
      })
    })
  })
})
