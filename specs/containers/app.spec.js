import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import App from "../../src/setUp/containers/app"
import Experiments from "../../src/setUp/containers/experiments"
import TabBar from "../../src/setUp/components/tabBar"


describe("App", () => {
  describe("contains", () => {
    it("tab bar", () => {
      const app = shallow(<App />)
      expect(app.find(TabBar)).to.have.length(1)
    })

    it("experiments", () => {
      const app = shallow(<App />)
      expect(app.find(Experiments)).to.have.length(1)
    })
  })
})
