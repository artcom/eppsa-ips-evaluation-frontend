import React from "react"
import styled from "styled-components"


const Container = styled.div`
  padding: 1em;
  width: 20em;
`

export const InputName = styled.div`
  padding: 1em;
`

export const InputField = styled.input`
  padding: 1em;
`


export default function Input({ field }) {
  return (
    <Container>
      <InputName>{ field.name }</InputName>
      <InputField type={ field.type } />
    </Container>
  )
}
