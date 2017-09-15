import React from "react"
import styled from "styled-components"
import Button from "./button"


const Container = styled.div`
  widht: 100%;
`

export default function SelectExperiment({ experiments, onSelect }) {
  return (
    <Container>
      {
        experiments && experiments.map(experiment =>
          <Button key={ experiment } onClick={ () => onSelect(experiment) }>{ experiment }</Button>
        )
      }
    </Container>
  )
}
