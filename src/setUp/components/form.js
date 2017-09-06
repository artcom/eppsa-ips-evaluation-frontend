import React from "react"
import styled from "styled-components"
import Input from "../components/input"


const StyledForm = styled.form`
  padding: 1em;
`

export default function Form() {
  return (
    <StyledForm>
      <Input />
    </StyledForm>
  )
}
