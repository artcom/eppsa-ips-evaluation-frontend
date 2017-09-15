import React from "react"
import styled from "styled-components"


export const StyledSelect = styled.select`
  padding: 1em;
`

export const Option = styled.option`
  font-size: 0.8em;
`

export default function Select({ options }) {
  return (
    <StyledSelect>
      {
        options.map(option => <Option key={ option } value={ option }>{ option }</Option>)
      }
    </StyledSelect>
  )
}
