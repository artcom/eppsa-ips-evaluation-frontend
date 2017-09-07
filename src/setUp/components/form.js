import React from "react"
import styled from "styled-components"
import Input, { InputField } from "../components/input"


const StyledForm = styled.form`
  padding: 1em;
`

export default function Form({ fields }) {
  return (
    <StyledForm>
      {
        fields && fields.map((field, i) =>
          <Input key={ i } field={ field } />
        )
      }
      <InputField type="submit" value="Create" />
    </StyledForm>
  )
}
