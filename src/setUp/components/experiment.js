import React from "react"
import styled from "styled-components"
import Button from "./button"


const Container = styled.div`
  font-size: 1em;
  width: 50em;
  display: flex;
`

export const Name = styled.div`
  font-size: 1em;
  width: 30em;
`

export default function Experiment({ name }) {
  return (
    <Container>
      <Name>{ name }</Name>
      <Button>Delete</Button>
    </Container>
  )
}
