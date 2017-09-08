import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import Experiments from "../containers/experiments"
import TabBar from "../components/tabBar"


const Container = styled.div`
  background-color: #F6F7F7;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      show: "experiments"
    }
  }

  render() {
    const tabs = ["experiments", "points"]
    return (
      <Container>
        <TabBar tabs={ tabs } highlight={ this.state.show } />
        {
          this.state.show === "experiments" && <Experiments backend={ this.props.backend } />
        }
      </Container>
    )
  }
}
