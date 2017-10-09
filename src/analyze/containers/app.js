/* eslint-disable react/no-did-mount-set-state */
import autoBind from "react-autobind"
import createPlotlyComponent from "react-plotlyjs"
import Plotly from "plotly.js/dist/plotly-gl3d"
import React from "react"
import Button from "../../shared/components/button"
import SelectCategory from "../../shared/components/selectCategory"
import { getExperiments } from "../../shared/actions/experimentsActions"
import { getPositionData } from "../actions/positionDataActions"
import { positionData3D } from "../processData"


const PlotlyComponent = createPlotlyComponent(Plotly)

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
      type: "surface" }] : []
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
            <PlotlyComponent data={ data } />
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
