import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import sinon from "sinon"
import Button from "../../../src/setUp/components/button"
import { hasTitle } from "../helpers/paramsHelpers"
import SelectCategory from "../../../src/setUp/components/selectCategory"


describe("SelectCategory", () => {
  describe("contains", () => {
    it("a title", () => {
      hasTitle(shallow(<SelectCategory title="Select Category:" />), "Select Category:")
    })

    it("selection buttons when categories prop is defined", () => {
      const categories = [{ name: "category1" }, { name: "category2" }]
      const selectCategory = shallow(<SelectCategory categories={ categories } />)
      expect(selectCategory.find(Button)).to.have.length(2)
      expect(selectCategory.find(Button).map(button => button.childAt(0).text()))
        .to.deep.equal(categories.map(category => category.name))
    })
  })

  describe("does", () => {
    it("call onSelect function when a select button is clicked", () => {
      const categories = [{ name: "category1" }, { name: "category2" }]
      const onSelectSpy = sinon.spy()
      const selectCategory = shallow(
        <SelectCategory
          categories={ categories }
          onSelect={ onSelectSpy } />
      )
      selectCategory
        .find(Button)
        .filterWhere(button => button.childAt(0).text() === "category1")
        .simulate("click")
      sinon.assert.calledOnce(onSelectSpy)
      sinon.assert.calledWith(onSelectSpy, { name: "category1" })
    })
  })
})
