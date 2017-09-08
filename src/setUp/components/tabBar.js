import React from "react"
import styled from "styled-components"
import Tab from "./tab"


const Container = styled.div`
  display: flex;
  background-color: #BFBFBF;
`

export default function TabBar() {
  return (
    <Container>
      <Tab>Experiments</Tab>
    </Container>
  )
}
