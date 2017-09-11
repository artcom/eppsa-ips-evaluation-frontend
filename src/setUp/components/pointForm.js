import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { backend } from "../../constants"
import Input, { InputField } from "../components/input"
import { setPoint } from "../actions/pointsActions"


const StyledForm = styled.form`
  padding: 1em;
`

export default class PointForm extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      name: "",
      X: "",
      Y: "",
      Z: ""
    }
  }

  render() {
    const fields = [
      { name: "name", type: "text", value: this.state.name, onChange: this.onInput },
      { name: "X", type: "text", value: this.state.X, onChange: this.onInput },
      { name: "Y", type: "text", value: this.state.Y, onChange: this.onInput },
      { name: "Z", type: "text", value: this.state.Z, onChange: this.onInput }
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
    await setPoint({
      backend,
      point: {
        name: this.state.name,
        trueCoordinateX: this.state.X,
        trueCoordinateY: this.state.Y,
        trueCoordinateZ: this.state.Z
      }
    })
    this.props.onSubmitted()
  }
}
