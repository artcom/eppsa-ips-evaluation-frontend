import React from "react"
import autoBind from "react-autobind"
import { zipObject } from "lodash"
import styled from "styled-components"
import { backend } from "../../constants"
import Input, { InputField } from "../components/input"


const StyledForm = styled.form`
  padding: 1em;
`

export default class Form extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = zipObject(
      this.props.fields.map(field => field.name),
      new Array(this.props.fields.length).fill("")
    )
  }

  render() {
    const { fields } = this.props
    const fieldsWithValues = fields.map(field => ({ ...field, value: this.state[field.name] }))

    return (
      <StyledForm onSubmit={ this.onSubmit }>
        {
          fieldsWithValues.map((field, i) =>
            <Input key={ i } field={ field } onInput={ this.onInput } />
          )
        }
        <InputField type="submit" value="Create" />
      </StyledForm>
    )
  }

  onInput(event, name) {
    const data = {}
    data[name] = event.target.value
    this.setState(data)
  }

  async onSubmit(event) {
    event.preventDefault()
    const setArgs = { backend }
    setArgs[this.props.paramName] = this.state
    if (this.props.processData) {
      await this.props.set(this.props.processData(setArgs))
    } else {
      await this.props.set(setArgs)
    }
    this.props.onSubmitted()
  }
}

Form.defaultProps = {
  processData: false
}
