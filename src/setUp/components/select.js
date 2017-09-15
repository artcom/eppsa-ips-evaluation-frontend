import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"


export const StyledSelect = styled.select`
  padding: 1em;
`

export const Option = styled.option`
  font-size: 0.8em;
`

export default class Select extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      value: this.props.options[0]
    }
  }

  render() {
    return (
      <StyledSelect
        onChange={ this.onChange }>
        {
          this.props.options.map(option =>
            <Option key={ option } value={ option }>{ option }</Option>
          )
        }
      </StyledSelect>
    )
  }

  onChange(event) {
    this.setState({ value: event.target.value })
    this.props.onInput(event, this.props.name)
  }
}
