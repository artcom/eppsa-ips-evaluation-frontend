import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { backend } from "../../constants"
import Input, { InputField } from "../components/input"
import { setExperiment } from "../actions/setExperiment"


const StyledForm = styled.form`
  padding: 1em;
`

export default class ExperimentForm extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = { name: "" }
  }

  render() {
    const field = { name: "name", type: "text", value: this.state.name, onChange: this.onChange }
    return (
      <StyledForm onSubmit={ this.onSubmit }>
        <Input field={ field } />
        <InputField type="submit" value="Create" />
      </StyledForm>
    )
  }

  onChange(event) {
    this.setState({ name: event.target.value })
  }

  onSubmit(event) {
    setExperiment({ backend, experimentName: this.state.name })
    this.props.onSubmitted()
    event.preventDefault()
  }
}
