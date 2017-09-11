import React from "react"
import styled from "styled-components"


const Container = styled.div`
  padding: 1em;
  width: 20em;
`

export const InputLabel = styled.label`
  padding: 1em;
`

export const InputField = styled.input`
  padding: 1em;
`


export default function Input({ field }) {
  const { name, type, value, onChange } = field
  return (
    <Container>
      <InputLabel>
        { name }
        <InputField type={ type } value={ value } onChange={ event => onChange(event, name) } />
      </InputLabel>
    </Container>
  )
}
