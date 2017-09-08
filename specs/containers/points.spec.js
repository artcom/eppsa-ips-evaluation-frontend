import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Points from "../../src/setUp/containers/points"
import Title from "../../src/setUp/components/title"


describe("Points", () => {
  describe("contains", () => {
    it("a title", () => {
      const points = shallow(<Points />)
      expect(points.find(Title)).to.have.length(1)
      expect(points.find(Title).childAt(0).text()).to.equal("Points:")
    })
  })
})
