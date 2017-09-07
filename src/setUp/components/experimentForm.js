import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import Input, { InputField } from "../components/input"


const StyledForm = styled.form`
  padding: 1em;
`

export default class ExperimentForm extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
  }

  render() {
    const field = { name: "name", type: "text" }
    return (
      <StyledForm>
        <Input field={ field } />
        <InputField type="submit" value="Create" />
      </StyledForm>
    )
  }
}
