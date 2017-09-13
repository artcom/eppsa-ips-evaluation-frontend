import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import Params from "./params"
import { deleteExperiment, getExperiments, setExperiment } from "../actions/experimentsActions"
import { getPoints, setPoint } from "../actions/pointsActions"
import Nodes from "../containers/nodes"
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
    const experimentFields = [{ name: "name", type: "text" }]
    const pointFields = [
      { name: "name", type: "text" },
      { name: "X", type: "text" },
      { name: "Y", type: "text" },
      { name: "Z", type: "text" }
    ]
    return (
      <Container>
        <TabBar tabs={ tabs } highlight={ this.state.show } onActivate={ this.onActivate } />
        {
          this.state.show === "experiments" &&
          <Params
            title="Experiments:"
            fields={ experimentFields }
            get={ getExperiments }
            set={ setExperiment }
            delete={ deleteExperiment }
            paramName="experiment"
            createText="Create Experiment"
            backend={ this.props.backend } />
        }
        {
          this.state.show === "points" &&
          <Params
            title="Points:"
            fields={ pointFields }
            get={ getPoints }
            set={ setPoint }
            paramName="point"
            createText="Add Point"
            backend={ this.props.backend } />
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
