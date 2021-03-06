import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import Input, { InputLabel, InputField } from "../../../src/shared/components/input"
import { checkProps } from "../../helpers/propsHelpers"
import Select from "../../../src/setUp/components/select"


describe("Input component", () => {
  it("is a styled.div", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .type().displayName).to.equal("styled.div")
  })

  it("contains an input name", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .find(InputLabel)).to.have.length(1)
  })

  it("contains an input field", () => {
    const field = { name: "name", type: "text" }
    expect(shallow(<Input field={ field } />)
      .find(InputField)).to.have.length(1)
  })

  it("contains a select field when type is select", () => {
    const field = { name: "name", type: "select" }
    expect(shallow(<Input field={ field } />)
      .find(Select)).to.have.length(1)
  })

  it("passes the expected props to select component", () => {
    const field = { name: "name", type: "select", options: ["option1", "option2"] }
    const onInput = a => a
    const props = { options: field.options, name: field.name, onInput }
    const select = shallow(<Input field={ field } onInput={ onInput } />).find(Select)
    checkProps({ mountedComponent: select, props })
  })

  it("passes the readonly prop to input component", () => {
    const field = { name: "name", type: "text", readOnly: true }
    const onInput = a => a
    const props = { type: field.type, readOnly: true }
    const inputField = shallow(<Input field={ field } onInput={ onInput } />).find(InputField)
    checkProps({ mountedComponent: inputField, props })
  })

  it("is not readonly by default", () => {
    const field = { name: "name", type: "text" }
    const onInput = a => a
    const props = { type: field.type, readOnly: false }
    const inputField = shallow(<Input field={ field } onInput={ onInput } />).find(InputField)
    checkProps({ mountedComponent: inputField, props })
  })
})
