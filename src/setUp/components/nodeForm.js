import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { backend } from "../../constants"
import Input, { InputField } from "../components/input"
import { setNode } from "../actions/nodesActions"


const StyledForm = styled.form`
  padding: 1em;
`

export default class PointForm extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      id: "",
      name: "",
      type: ""
    }
  }

  render() {
    const fields = [
      { name: "id", type: "text", value: this.state.id },
      { name: "name", type: "text", value: this.state.name },
      { name: "type", type: "text", value: this.state.type }
    ]

    return (
      <StyledForm onSubmit={ this.onSubmit }>
        {
          fields.map((field, i) => <Input key={ i } field={ field } onInput={ this.onInput } />)
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
    await setNode({
      backend,
      node: this.state
    })
    this.props.onSubmitted()
  }
}
