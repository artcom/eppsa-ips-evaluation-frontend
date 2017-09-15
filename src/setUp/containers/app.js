/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import Button from "../components/button"
import Params from "./params"
import SelectExperiment from "../components/selectExperiment"
import TabBar from "../components/tabBar"
import { deleteExperiment, getExperiments, setExperiment } from "../actions/experimentsActions"
import { getNodes, setNode } from "../actions/nodesActions"
import { getNodePositions, setNodePosition } from "../actions/nodePositionsActions"
import { getPoints, setPoint } from "../actions/pointsActions"


const Container = styled.div`
  background-color: #F6F7F7;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      show: "experiments",
      experiments: [],
      loaded: false,
      selectedExperiment: null,
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
    const tabs = ["experiments", "points", "nodes", "nodePositions"]
    const experimentFields = [{ name: "name", type: "text" }]
    const pointFields = [
      { name: "name", type: "text" },
      { name: "X", type: "text" },
      { name: "Y", type: "text" },
      { name: "Z", type: "text" }
    ]
    const nodeFields = [
      { name: "id", type: "text" },
      { name: "name", type: "text" },
      { name: "type", type: "text" }
    ]
    const nodePositionsFields = [
      { name: "nodeName", type: "text" },
      { name: "pointName", type: "text" },
      { name: "experimentName", type: "text" }
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
          this.state.show === "nodes" &&
          <Params
            title="Nodes:"
            fields={ nodeFields }
            get={ getNodes }
            set={ setNode }
            paramName="node"
            createText="Add Node"
            backend={ this.props.backend } />
        }
        {
          this.state.show === "nodePositions" &&
          this.state.loaded &&
          this.state.selectedExperiment &&
          <div>
            <Params
              key={ this.state.selectedExperiment }
              title={ `Node Positions for "${this.state.selectedExperiment}":` }
              fields={ nodePositionsFields }
              get={ getNodePositions }
              set={ setNodePosition }
              paramName="nodePosition"
              createText={ `Set Node Position in "${this.state.selectedExperiment}"` }
              experiment={ this.state.selectedExperiment }
              backend={ this.props.backend } />
            <Button
              onClick={ () => this.onSelectExperiment({ name: null }) }>
              Select Other Experiment
            </Button>
          </div>
        }
        {
          this.state.show === "nodePositions" &&
          this.state.loaded &&
          !this.state.selectedExperiment &&
          <SelectExperiment
            experiments={ this.state.experiments }
            onSelect={ this.onSelectExperiment } />
        }
      </Container>
    )
  }

  onActivate(tab) {
    this.setState({ show: tab })
  }

  onSelectExperiment(experiment) {
    this.setState({ selectedExperiment: experiment.name })
  }
}
