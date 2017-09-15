import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import sinon from "sinon"
import Button from "../../src/setUp/components/button"
import SelectExperiment from "../../src/setUp/components/selectExperiment"


describe("SelectExperiment", () => {
  describe("contains", () => {
    it("experiment selection buttons when experiments prop is defined", () => {
      const experiments = ["fake-experiment1", "fake-experiment2"]
      const selectExperiment = shallow(<SelectExperiment experiments={ experiments } />)
      expect(selectExperiment.find(Button)).to.have.length(2)
      expect(selectExperiment.find(Button).map(button => button.childAt(0).text()))
        .to.deep.equal(experiments)
    })
  })

  describe("does", () => {
    it("call onSelect function when a select button is clicked", () => {
      const experiments = ["fake-experiment1", "fake-experiment2"]
      const onSelectSpy = sinon.spy()
      const selectExperiment = shallow(
        <SelectExperiment
          experiments={ experiments }
          onSelect={ onSelectSpy } />
      )
      selectExperiment
        .find(Button)
        .filterWhere(button => button.childAt(0).text() === "fake-experiment1")
        .simulate("click")
      sinon.assert.calledOnce(onSelectSpy)
      sinon.assert.calledWith(onSelectSpy, "fake-experiment1")
    })
  })
})
