import React from "react"
import styled from "styled-components"
import Button from "../../setUp/components/button"
import Title from "../../setUp/components/title"


const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export default function SelectCategory({ title, categories, onSelect }) {
  return (
    <Container>
      <Title>{ title }</Title>
      {
        categories && categories.map(category =>
          <Button
            key={ category.name }
            onClick={ () => onSelect(category) }>
            {
              category.name
            }
          </Button>
        )
      }
    </Container>
  )
}
