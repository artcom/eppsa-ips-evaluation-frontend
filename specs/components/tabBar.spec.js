import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Tab from "../../src/setUp/components/tab"
import TabBar from "../../src/setUp/components/tabBar"


describe("TabBar", () => {
  describe("contains", () => {
    it("an experiments tab", () => {
      const app = shallow(<TabBar />)
      expect(app.find(Tab).findWhere(tab => tab.childAt(0).text() === "Experiments"))
        .to.have.length(1)
    })
  })
})
