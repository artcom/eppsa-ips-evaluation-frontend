import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import Input, { InputField, InputLabel } from "../../src/setUp/components/input"
import PointForm from "../../src/setUp/components/pointForm"


describe("PointForm component", () => {
  it("is a form", () => {
    expect(shallow(<PointForm />)
      .type().displayName).to.equal("styled.form")
  })

  describe("contains", () => {
    it("a Create submit input", () => {
      const pointForm = shallow(<PointForm />)
      expect(pointForm.find(InputField)).to.have.length(1)
      expect(pointForm.find(InputField).props().type)
        .to.equal("submit")
      expect(pointForm.find(InputField).props().value)
        .to.equal("Create")
    })

    it("an Input component", () => {
      expect(shallow(<PointForm />).find(Input)).to.have.length(4)
    })

    it("an input text field for point name with a label", () => {
      const pointForm = mount(<PointForm />)
      expect(pointForm.find(Input).at(0).childAt(0).type().displayName)
        .to.equal("styled.label")
      expect(pointForm.find(Input).at(0).childAt(0).text()).to.equal("name")
      expect(pointForm.find(InputLabel).at(0).childAt(0).type().displayName)
        .to.equal("styled.input")
      expect(pointForm.find(InputLabel).at(0).childAt(0).props().type)
        .to.equal("text")
      expect(pointForm.find(InputLabel).at(0).childAt(0).props().value)
        .to.equal("")
    })

    it("an input text field for point X coordinate with a label", () => {
      const pointForm = mount(<PointForm />)
      expect(pointForm.find(Input).at(1).childAt(0).type().displayName)
        .to.equal("styled.label")
      expect(pointForm.find(Input).at(1).childAt(0).text()).to.equal("X")
      expect(pointForm.find(InputLabel).at(1).childAt(0).type().displayName)
        .to.equal("styled.input")
      expect(pointForm.find(InputLabel).at(1).childAt(0).props().type)
        .to.equal("text")
      expect(pointForm.find(InputLabel).at(1).childAt(0).props().value)
        .to.equal("")
    })

    it("an input text field for point Y coordinate with a label", () => {
      const pointForm = mount(<PointForm />)
      expect(pointForm.find(Input).at(2).childAt(0).type().displayName)
        .to.equal("styled.label")
      expect(pointForm.find(Input).at(2).childAt(0).text()).to.equal("Y")
      expect(pointForm.find(InputLabel).at(2).childAt(0).type().displayName)
        .to.equal("styled.input")
      expect(pointForm.find(InputLabel).at(2).childAt(0).props().type)
        .to.equal("text")
      expect(pointForm.find(InputLabel).at(2).childAt(0).props().value)
        .to.equal("")
    })

    it("an input text field for point Z coordinate with a label", () => {
      const pointForm = mount(<PointForm />)
      expect(pointForm.find(Input).at(3).childAt(0).type().displayName)
        .to.equal("styled.label")
      expect(pointForm.find(Input).at(3).childAt(0).text()).to.equal("Z")
      expect(pointForm.find(InputLabel).at(3).childAt(0).type().displayName)
        .to.equal("styled.input")
      expect(pointForm.find(InputLabel).at(3).childAt(0).props().type)
        .to.equal("text")
      expect(pointForm.find(InputLabel).at(3).childAt(0).props().value)
        .to.equal("")
    })
  })
})
