import React from "react"
import styled from "styled-components"
import Button from "./button"
import Title from "./title"


const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export default function SelectExperiment({ experiments, onSelect }) {
  return (
    <Container>
      <Title>Select Experiment:</Title>
      {
        experiments && experiments.map(experiment =>
          <Button
            key={ experiment.name }
            onClick={ () => onSelect(experiment) }>
            {
              experiment.name
            }
          </Button>
        )
      }
    </Container>
  )
}
