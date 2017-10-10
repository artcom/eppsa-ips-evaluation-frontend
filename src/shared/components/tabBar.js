import React from "react"
import styled from "styled-components"
import { upperFirst } from "lodash"
import Tab from "./tab"


const Container = styled.div`
  display: flex;
  background-color: #BFBFBF;
`

export default function TabBar({ tabs, highlight, onActivate }) {
  return (
    <Container>
      {
        tabs.map((tab, i) =>
          <Tab
            key={ i }
            highlight={ tab === highlight }
            onClick={ async () => await onActivate(tab) }>
            {
              upperFirst(tab)
            }
          </Tab>
        )
      }
    </Container>
  )
}
