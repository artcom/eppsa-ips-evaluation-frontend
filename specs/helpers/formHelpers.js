import { expect } from "chai"
import sinon from "sinon"
import { findInputField } from "./findElements"
import Input, { InputField, InputLabel } from "../../src/setUp/components/input"


export function isAForm(form) {
  expect(form
    .type().displayName).to.equal("styled.form")
}

export function hasSubmit(form, name) {
  expect(form.find(InputField)).to.have.length(1)
  expect(form.find(InputField).props().type)
    .to.equal("submit")
  expect(form.find(InputField).props().value)
    .to.equal(name)
}

export function hasInputs(form, inputs) {
  expect(form.find(Input)).to.have.length(inputs.length)
  for (const input of inputs) {
    const i = inputs.indexOf(input)
    expect(form.find(Input).at(i).childAt(0).type().displayName)
      .to.equal("styled.label")
    expect(form.find(Input).at(i).childAt(0).text()).to.equal(input.name)
    expect(form.find(InputLabel).at(i).childAt(0).type().displayName)
      .to.equal("styled.input")
    expect(form.find(InputLabel).at(i).childAt(0).props().type)
      .to.equal(input.type)
    expect(form.find(InputLabel).at(i).childAt(0).props().value)
      .to.equal("")
  }
}

export function storeInput(form, inputs) {
  for (const input of inputs) {
    findInputField(form, input.name).simulate("change", { target: { value: input.value } })
    expect(form.state(input.name)).to.equal(input.value)
  }
}

export function callSubmitFunctions(form, input, callArgs, setMock, onSubmitted, done) {
  form.setState(input)
  form.simulate("submit")
  sinon.assert.calledOnce(setMock)
  sinon.assert.calledWith(setMock, callArgs)
  setImmediate(() => {
    sinon.assert.calledOnce(onSubmitted)
    done()
  })
}
