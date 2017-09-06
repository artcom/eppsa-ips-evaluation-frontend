import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Title from "../../src/setUp/components/title"


describe("Title component", () => {
  it("contains a title div", () => {
    expect(shallow(<Title />)
      .find("div").length).to.equal(1)
  })

  it("contains a title div with the expected text", () => {
    expect(shallow(<Title>Title: </Title>)
      .find("div").text()).to.equal("Title: ")
  })
})
