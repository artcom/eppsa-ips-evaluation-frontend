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
      { name: "name", type: "text", value: this.state.name, onChange: this.onChangeName },
      { name: "X", type: "text", value: this.state.X, onChange: this.onChangeX },
      { name: "Y", type: "text", value: this.state.Y, onChange: this.onChangeY },
      { name: "Z", type: "text", value: this.state.Z, onChange: this.onChangeZ }
    ]

    return (
      <StyledForm onSubmit={ this.onSubmit }>
        {
          fields.map((field, i) => <Input key={ i } field={ field } />)
        }
        <InputField type="submit" value="Create" />
      </StyledForm>
    )
  }

  onChangeName(event) {
    this.setState({ name: event.target.value })
  }

  onChangeX(event) {
    this.setState({ X: event.target.value })
  }

  onChangeY(event) {
    this.setState({ Y: event.target.value })
  }

  onChangeZ(event) {
    this.setState({ Z: event.target.value })
  }

  async onSubmit(event) {
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
    event.preventDefault()
  }
}
