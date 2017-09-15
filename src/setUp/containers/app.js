/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { assignIn, zipObject } from "lodash"
import Button from "../components/button"
import Params from "./params"
import SelectExperiment from "../components/selectExperiment"
import TabBar from "../components/tabBar"
import { deleteExperiment, getExperiments, setExperiment } from "../actions/experimentsActions"
import { getNodes, setNode } from "../actions/nodesActions"
import { getNodePositions, setNodePosition } from "../actions/nodePositionsActions"
import { getPoints, setPoint } from "../actions/pointsActions"
import { getZones, setZone } from "../actions/zoneActions"


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
      nodes: [],
      points: [],
      loaded: false,
      selectedExperiment: null,
    }
  }

  async componentDidMount() {
    const params = ["experiments", "nodes", "points"]
    const data = await Promise.all([
      getExperiments({ backend: this.props.backend }),
      getNodes({ backend: this.props.backend }),
      getPoints({ backend: this.props.backend })
    ])
    this.setState(assignIn(zipObject(params, data), { loaded: true }))
  }

  render() {
    const tabs = ["experiments", "points", "zones", "nodes", "nodePositions"]
    const experimentFields = [{ name: "name", type: "text" }]
    const pointFields = [
      { name: "name", type: "text" },
      { name: "X", type: "text" },
      { name: "Y", type: "text" },
      { name: "Z", type: "text" }
    ]
    const zoneFields = [
      { name: "name", type: "text" },
      { name: "xMin", type: "text" },
      { name: "xMax", type: "text" },
      { name: "yMin", type: "text" },
      { name: "yMax", type: "text" },
      { name: "zMin", type: "text" },
      { name: "zMax", type: "text" }
    ]
    const nodeFields = [
      { name: "id", type: "text" },
      { name: "name", type: "text" },
      { name: "type", type: "text" }
    ]
    const nodePositionsFields = [
      { name: "nodeName", type: "select", options: this.state.nodes.map(node => node.name) },
      { name: "pointName", type: "select", options: this.state.points.map(point => point.name) },
      { name: "experimentName", type: "text", value: this.state.selectedExperiment, readOnly: true }
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
          this.state.show === "zones" &&
          <Params
            title="Zones:"
            fields={ zoneFields }
            get={ getZones }
            set={ setZone }
            paramName="zone"
            createText="Add Zone"
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
