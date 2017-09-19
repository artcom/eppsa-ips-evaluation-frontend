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
  const { name, type, value, checked } = field
  return (
    <Container>
      <InputLabel>
        { name }
        {
          type === "select"
            ? <Select options={ field.options } onInput={ onInput } name={ name } />
            : <InputField
              type={ type }
              value={ value }
              checked={ checked }
              onChange={ event => onInput(event, name) }
              readOnly={ field.readOnly != null ? field.readOnly : false } />
        }
      </InputLabel>
    </Container>
  )
}
