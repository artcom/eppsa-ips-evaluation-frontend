import React from "react"
import styled from "styled-components"
import Select from "./select"


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

export default function Input({ field, onInput }) {
  const { name, type, value } = field
  return (
    <Container>
      <InputLabel>
        { name }
        {
          type === "select"
            ? <Select options={ field.options } />
            : <InputField
              type={ type }
              value={ value }
              onChange={ event => onInput(event, name) } />
        }
      </InputLabel>
    </Container>
  )
}
