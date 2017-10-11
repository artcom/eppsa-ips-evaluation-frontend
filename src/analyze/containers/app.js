/* eslint-disable react/no-did-mount-set-state */
import { keys, pickBy } from "lodash"
import autoBind from "react-autobind"
import createPlotlyComponent from "react-plotlyjs"
import Plotly from "plotly.js/dist/plotly-gl3d"
import React from "react"
import styled from "styled-components"
import Button from "../../shared/components/button"
import Form from "../../shared/components/form"
import SelectCategory from "../../shared/components/selectCategory"
import TabBar from "../../shared/components/tabBar"
import { getExperiments } from "../../shared/actions/experimentsActions"
import { getPositionData } from "../actions/positionDataActions"
import { positionData3D } from "../processData"


const PlotlyComponent = createPlotlyComponent(Plotly)

const ChartContainer = styled.div`
  width: 1200px;
  height: 1200px;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      show: "pointErrors",
      experiments: [],
      positionData: [],
      selectedExperiment: null,
      compareExperiments: [],
      loaded: false
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
    const tabs = ["pointErrors", "experimentMetrics"]
    const compareExperimentsFields = this.state.experiments.map(experiment =>
      ({ ...experiment, type: "checkBox" })
    )
    const scenes = ["scene1", "scene2"]
    const data = this.state.positionData.length > 0 ? scenes.map(scene =>
      [{
        ...positionData3D(this.state.positionData),
        type: "surface",
        cauto: false,
        cmin: 0,
        cmax: 4,
        colorbar: {
          title: "2D Error (m)",
          titleside: "right",
          lenmode: "fraction",
          len: 0.75,
          x: 0.8
        },
        scene
      }]) : [[], []]
    const defaultScene = {
      aspectratio: { x: 1, y: 9 / 11.5, z: 5 / 11.5 },
      xaxis: {
        range: [0, 11.5],
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        gridcolor: "rgb(0, 0, 0)",
        zerolinecolor: "rgb(0, 0, 0)"
      },
      yaxis: {
        range: [0, 9],
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        gridcolor: "rgb(0, 0, 0)",
        zerolinecolor: "rgb(0, 0, 0)"
      },
      zaxis: {
        range: [0, 5],
        nticks: 10,
        backgroundcolor: "rgb(200, 200, 200)",
        gridcolor: "rgb(0, 0, 0)",
        showbackground: true,
        zerolinecolor: "rgb(0, 0, 0)"
      }
    }
    const cameras = [
      {
        center: { x: 0, y: 0, z: 0 },
        eye: { x: 0, y: 0, z: 1.5 },
        up: { x: 1, y: 0, z: 1 }
      },
      {
        center: { x: 0, y: 0, z: 0 },
        eye: { x: 0.5, y: -1.5, z: 0.5 },
        up: { x: 1, y: 0, z: 1 }
      }
    ]
    const layout = {
      title: this.state.selectedExperiment,
      autosize: false,
      width: 1200,
      height: 600,
      margin: { l: 0, r: 0, b: 20, t: 40 },
    }
    for (const scene of scenes) {
      layout[scene] = Object.assign({}, { ...defaultScene, camera: cameras[scenes.indexOf(scene)] })
    }
    return (
      <div>
        <TabBar tabs={ tabs } highlight={ this.state.show } onActivate={ this.onActivate } />
        {
          this.state.loaded &&
          this.state.show === "pointErrors" &&
          !this.state.selectedExperiment &&
          <SelectCategory
            title="Select Experiment:"
            categories={ this.state.experiments }
            onSelect={ this.onSelectExperiment } />
        }
        {
          this.state.loaded &&
          this.state.show === "pointErrors" &&
          this.state.selectedExperiment &&
          <div>
            <ChartContainer>
              {
                data.map((datum, i) =>
                  <PlotlyComponent key={ i } data={ datum } layout={ layout } />
                )
              }
            </ChartContainer>
            <Button
              onClick={ async () => await this.onSelectExperiment({ name: null }) }>
              Select Other Experiment
            </Button>
          </div>
        }
        {
          this.state.loaded &&
          this.state.show === "experimentMetrics" &&
          this.state.compareExperiments &&
          <Form
            submitName="Compare"
            fields={ compareExperimentsFields }
            paramName="compareExperiments"
            set={ (args) =>
              this.setState({ compareExperiments: keys(pickBy(args.compareExperiments)) })
            } />
        }
      </div>
    )
  }

  onActivate(tab) {
    this.setState({ show: tab })
  }

  async onSelectExperiment(experiment) {
    const experimentName = experiment.name
    if (experimentName != null) {
      const positionData = await getPositionData({ backend: this.props.backend, experimentName })
      this.setState({ selectedExperiment: experimentName, positionData })
    }
    this.setState({ selectedExperiment: experimentName })
  }
}
