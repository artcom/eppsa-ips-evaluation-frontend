/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it, beforeEach, afterEach } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import sinon from "sinon"
import proxyquire from "proxyquire"
import { backend } from "../../src/constants"
import Input, { InputField, InputLabel } from "../../src/setUp/components/input"
import PointForm from "../../src/setUp/components/pointForm"
const pointActions = require("../../src/setUp/actions/pointsActions")


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

  describe("does", () => {
    beforeEach(() => {
      global.setMockPoint = sinon.stub(pointActions, "setPoint")
        .resolves("point1")
      proxyquire(
        "../../src/setUp/components/pointForm",
        { setPoint: { setPoint: global.setMockPoint } }
      )
    })

    afterEach(() => {
      global.setMockPoint.restore()
    })

    it("store point name in state when changed in input field", () => {
      const pointForm = mount(<PointForm />)
      const pointNameInputField = pointForm
        .find(InputLabel)
        .filterWhere(field => field.text() === "name")
        .find(InputField)
      pointNameInputField.simulate("change", { target: { value: "point1" } })
      expect(pointForm.state("name")).to.equal("point1")
    })

    it("store point X coordinate in state when changed in input field", () => {
      const pointForm = mount(<PointForm />)
      const pointNameInputField = pointForm
        .find(InputLabel)
        .filterWhere(field => field.text() === "X")
        .find(InputField)
      pointNameInputField.simulate("change", { target: { value: 1 } })
      expect(pointForm.state("X")).to.equal(1)
    })

    it("store point Y coordinate in state when changed in input field", () => {
      const pointForm = mount(<PointForm />)
      const pointNameInputField = pointForm
        .find(InputLabel)
        .filterWhere(field => field.text() === "Y")
        .find(InputField)
      pointNameInputField.simulate("change", { target: { value: 1 } })
      expect(pointForm.state("Y")).to.equal(1)
    })

    it("store point Z coordinate in state when changed in input field", () => {
      const pointForm = mount(<PointForm />)
      const pointNameInputField = pointForm
        .find(InputLabel)
        .filterWhere(field => field.text() === "Z")
        .find(InputField)
      pointNameInputField.simulate("change", { target: { value: 2 } })
      expect(pointForm.state("Z")).to.equal(2)
    })

    it("call setPoint and onSubmitted with the expected data when form is submitted",
      done => {
        const onSubmitted = sinon.spy()
        const pointForm = mount(<PointForm onSubmitted={ onSubmitted } />)
        pointForm.setState({ name: "point1", X: 1, Y: 1, Z: 2 })
        pointForm.simulate("submit")
        sinon.assert.calledOnce(global.setMockPoint)
        sinon.assert.calledWith(
          global.setMockPoint,
          {
            backend,
            point: {
              name: "point1",
              trueCoordinateX: 1,
              trueCoordinateY: 1,
              trueCoordinateZ: 2
            }
          }
        )
        setImmediate(() => {
          sinon.assert.calledOnce(onSubmitted)
          done()
        })
      })
  })
})
