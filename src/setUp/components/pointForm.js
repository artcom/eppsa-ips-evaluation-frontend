import React from "react"
import styled from "styled-components"
import Input, { InputField } from "../components/input"


const StyledForm = styled.form`
  padding: 1em;
`

export default function PointForm() {
  const fields = [
    { name: "name", type: "text", value: "" },
    { name: "X", type: "text", value: "" },
    { name: "Y", type: "text", value: "" },
    { name: "Z", type: "text", value: "" }
  ]

  return (
    <StyledForm>
      {
        fields.map((field, i) => <Input key={ i } field={ field } />)
      }
      <InputField type="submit" value="Create" />
    </StyledForm>
  )
}
