/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import styled from "styled-components"
import { assignIn, zipObject } from "lodash"
import Button from "../components/button"
import Params from "./params"
import Run from "./run"
import SelectCategory from "../components/selectCategory"
import TabBar from "../components/tabBar"
import {
  deleteExperiment,
  getExperiments,
  setExperiment,
  runExperiment
} from "../actions/experimentsActions"
import { deleteNode, getNodes, setNode } from "../actions/nodesActions"
import {
  deleteNodePosition,
  getNodePositions,
  setNodePosition
} from "../actions/nodePositionsActions"
import { deletePoint, getPoints, setPoint } from "../actions/pointsActions"
import { deleteZone, getZones, setZone } from "../actions/zonesActions"
import { getZoneSets, setZoneSet, deleteZoneSet } from "../actions/zoneSetsActions"


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
      zoneSets: [],
      nodes: [],
      points: [],
      loaded: false,
      selectedExperiment: null,
      selectedZoneSet: null
    }
  }

  async componentDidMount() {
    console.debug(`using backend: ${this.props.backend}`)
    const params = ["experiments", "zoneSets", "nodes", "points"]
    const data = await Promise.all([
      getExperiments({ backend: this.props.backend }),
      getZoneSets({ backend: this.props.backend }),
      getNodes({ backend: this.props.backend }),
      getPoints({ backend: this.props.backend })
    ])
    this.setState(assignIn(zipObject(params, data), { loaded: true }))
  }

  render() {
    const tabs = ["experiments", "points", "zoneSets", "zones", "nodes", "nodePositions", "run"]
    const experimentFields = [{ name: "name", type: "text" }]
    const pointFields = [
      { name: "name", type: "text" },
      { name: "X", type: "text" },
      { name: "Y", type: "text" },
      { name: "Z", type: "text" }
    ]
    const zoneSetFields = [{ name: "name", type: "text" }]
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
    const runFields = [
      { name: "Quuppa", type: "checkBox" },
      { name: "GoIndoor", type: "checkBox" },
      { name: "repeats", type: "text" },
      { name: "interval", type: "text" }
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
          this.state.show === "zoneSets" &&
            <Params
              title="ZoneSets:"
              fields={ zoneSetFields }
              get={ getZoneSets }
              set={ setZoneSet }
              delete={ deleteZoneSet }
              paramName="zoneSet"
              createText="Create Zone Set"
              backend={ this.props.backend } />
        }
        {
          this.state.show === "zones" &&
          this.state.loaded &&
          this.state.selectedZoneSet &&
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
          this.state.show === "zones" &&
          this.state.loaded &&
          !this.state.selectedZoneSet &&
          <SelectCategory
            categories={ this.state.zoneSets }
            onSelect={ this.onSelectZoneSet } />
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
              delete={ deleteNodePosition }
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
          <SelectCategory
            categories={ this.state.experiments }
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
          <SelectCategory
            categories={ this.state.experiments }
            onSelect={ this.onSelectExperiment } />
        }
      </Container>
    )
  }

  async onActivate(tab) {
    if (tab === "nodePositions" && this.state.show !== tab) {
      const params = ["experiments", "nodes", "points"]
      const data = await Promise.all([
        getExperiments({ backend: this.props.backend }),
        getNodes({ backend: this.props.backend }),
        getPoints({ backend: this.props.backend })
      ])
      this.setState(assignIn(zipObject(params, data), { show: tab }))
    } else if (tab === "run" && this.state.show !== tab) {
      const data = await getExperiments({ backend: this.props.backend })
      this.setState({ experiments: data, show: tab })
    } else {
      this.setState({ show: tab })
    }
  }

  onSelectExperiment(experiment) {
    this.setState({ selectedExperiment: experiment.name })
  }

  onSelectZoneSet(zoneSet) {
    this.setState({ selectedZoneSet: zoneSet.name })
  }
}
