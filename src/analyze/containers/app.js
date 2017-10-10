/* eslint-disable react/no-did-mount-set-state */
import autoBind from "react-autobind"
import createPlotlyComponent from "react-plotlyjs"
import Plotly from "plotly.js/dist/plotly-gl3d"
import React from "react"
import styled from "styled-components"
import Button from "../../shared/components/button"
import SelectCategory from "../../shared/components/selectCategory"
import { getExperiments } from "../../shared/actions/experimentsActions"
import { getPositionData } from "../actions/positionDataActions"
import { positionData3D } from "../processData"


const PlotlyComponent = createPlotlyComponent(Plotly)

const ChartContainer = styled.div`
  width: 1200px;
  height: 600px;
`

export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: [],
      positionData: [],
      selectedExperiment: null,
      loaded: false
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
    const data = this.state.positionData.length > 0 ? [{
      ...positionData3D(this.state.positionData),
      type: "surface",
      cauto: false,
      cmin: 0,
      cmax: 4,
      scene: "scene1"
    }] : []
    const layout = {
      autosize: false,
      width: 1200,
      height: 600,
      margin: {
        l: 0,
        r: 0,
        b: 20,
        t: 20,
      },
      scene1: {
        aspectratio: { x: 1, y: 9 / 11.5, z: 5 / 11.5 },
        camera: {
          center: {
            x: 0, y: 0, z: 0
          },
          eye: {
            x: 0, y: 0, z: 1.5
          },
          up: {
            x: 1, y: 0, z: 1
          }
        },
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
          nticks: 6,
          backgroundcolor: "rgb(200, 200, 200)",
          gridcolor: "rgb(0, 0, 0)",
          showbackground: true,
          zerolinecolor: "rgb(0, 0, 0)"
        }
      }
    }
    return (
      <div>
        {
          this.state.loaded &&
          !this.state.selectedExperiment &&
          <SelectCategory
            title="Select Experiment:"
            categories={ this.state.experiments }
            onSelect={ this.onSelectExperiment } />
        }
        {
          this.state.loaded &&
          this.state.selectedExperiment &&
          <div>
            <ChartContainer>
              <PlotlyComponent data={ data } layout={ layout } />
            </ChartContainer>
            <Button
              onClick={ async () => await this.onSelectExperiment({ name: null }) }>
              Select Other Experiment
            </Button>
          </div>
        }
      </div>
    )
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
