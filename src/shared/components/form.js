import React from "react"
import autoBind from "react-autobind"
import { find, zipObject } from "lodash"
import styled from "styled-components"
import Input, { InputField } from "./input"


const StyledForm = styled.form`
  padding: 1em;
`

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = setInitialValues(this.props.fields)
  }

  render() {
    const { fields, submitName } = this.props
    const fieldsWithValues = fields.map(field => field.type === "checkBox"
      ? { ...field, checked: this.state[field.name] }
      : { ...field, value: this.state[field.name] }
    )

    return (
      <StyledForm onSubmit={ this.onSubmit }>
        {
          fieldsWithValues.map((field, i) =>
            <Input key={ i } field={ field } onInput={ this.onInput } />
          )
        }
        <InputField type="submit" value={ submitName } />
      </StyledForm>
    )
  }

  onInput(event, name) {
    const data = {}
    const type = find(this.props.fields, field => field.name === name).type
    data[name] = type === "checkBox" ? event.target.checked : event.target.value
    this.setState(data)
  }

  async onSubmit(event) {
    event.preventDefault()
    const setArgs = getSetArgs(this.props)
    setArgs[this.props.paramName] = this.state
    await this.props.set(setArgs)
    if (this.props.onSubmitted) {
      this.props.onSubmitted()
    }
  }
}

export function setInitialValues(fields) {
  return zipObject(
    fields.map(field => field.name),
    fields.map(getValue)
  )
}

function getValue(field) {
  if (field.type === "select") {
    return field.options[0]
  } else if (field.value) {
    return field.value
  } else if (field.type === "checkBox") {
    return false
  } else {
    return ""
  }
}

function getSetArgs({ backend, experimentName, zoneSetName }) {
  if (experimentName) {
    return { backend, experimentName }
  } else if (zoneSetName) {
    return { backend, zoneSetName }
  } else {
    return { backend }
  }
}
