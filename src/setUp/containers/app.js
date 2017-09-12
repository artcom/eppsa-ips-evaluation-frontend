import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import Experiments from "../containers/experiments"
import Nodes from "../containers/nodes"
import Points from "../containers/points"
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
    const tabs = ["experiments", "points", "nodes"]
    return (
      <Container>
        <TabBar tabs={ tabs } highlight={ this.state.show } onActivate={ this.onActivate } />
        {
          this.state.show === "experiments" && <Experiments backend={ this.props.backend } />
        }
        {
          this.state.show === "points" && <Points backend={ this.props.backend } />
        }
        {
          this.state.show === "nodes" && <Nodes backend={ this.props.backend } />
        }
      </Container>
    )
  }

  onActivate(tab) {
    this.setState({ show: tab })
  }
}
