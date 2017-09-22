/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { assignIn, zipObject } from "lodash"
import Button from "../components/button"
import Params from "./params"
import Run from "./run"
import SelectExperiment from "../components/selectExperiment"
import TabBar from "../components/tabBar"
import {
  deleteExperiment,
  getExperiments,
  setExperiment,
  runExperiment
} from "../actions/experimentsActions"
import { deleteNode, getNodes, setNode } from "../actions/nodesActions"
import { getNodePositions, setNodePosition } from "../actions/nodePositionsActions"
import { deletePoint, getPoints, setPoint } from "../actions/pointsActions"
import { deleteZone, getZones, setZone } from "../actions/zonesActions"


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
    console.debug(`using backend: ${this.props.backend}`)
    const params = ["experiments", "nodes", "points"]
    const data = await Promise.all([
      getExperiments({ backend: this.props.backend }),
      getNodes({ backend: this.props.backend }),
      getPoints({ backend: this.props.backend })
    ])
    this.setState(assignIn(zipObject(params, data), { loaded: true }))
  }

  async componentWillUpdate(nextProps, nextState) {
    if (nextState.show === "nodePositions" && this.state.show !== nextState.show) {
      await Promise.all([
        getExperiments({ backend: this.props.backend }),
        getNodes({ backend: this.props.backend }),
        getPoints({ backend: this.props.backend })
      ])
    }
    if (nextState.show === "run" && this.state.show !== nextState.show) {
      await getExperiments({ backend: this.props.backend })
    }
  }

  render() {
    const tabs = ["experiments", "points", "zones", "nodes", "nodePositions", "run"]
    const experimentFields = [{ name: "name", type: "text" }]
    const pointFields = [
      { name: "name", type: "text" },
      { name: "X", type: "number" },
      { name: "Y", type: "number" },
      { name: "Z", type: "number" }
    ]
    const zoneFields = [
      { name: "name", type: "text" },
      { name: "xMin", type: "number" },
      { name: "xMax", type: "number" },
      { name: "yMin", type: "number" },
      { name: "yMax", type: "number" },
      { name: "zMin", type: "number" },
      { name: "zMax", type: "number" }
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
    const runFields = [
      { name: "Quuppa", type: "checkBox" },
      { name: "GoIndoor", type: "checkBox" },
      { name: "repeats", type: "number" },
      { name: "interval", type: "number" }
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
            delete={ deletePoint }
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
            delete={ deleteZone }
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
            delete={ deleteNode }
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
        {
          this.state.show === "run" &&
          this.state.loaded &&
          this.state.selectedExperiment &&
          <div>
            <Run
              experiment={ this.state.selectedExperiment }
              title={ `Set up "${this.state.selectedExperiment}":` }
              fields={ runFields }
              paramName="run"
              set={ runExperiment } />
            <Button
              onClick={ () => this.onSelectExperiment({ name: null }) }>
              Select Other Experiment
            </Button>
          </div>
        }
        {
          this.state.show === "run" &&
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
