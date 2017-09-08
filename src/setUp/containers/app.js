import React from "react"
import styled from "styled-components"
import Experiments from "../containers/experiments"
import TabBar from "../components/tabBar"


const Container = styled.div`
  background-color: #F6F7F7;
`

export default function({ backend }) {
  return (
    <Container>
      <TabBar />
      <Experiments backend={ backend } />
    </Container>
  )
}
