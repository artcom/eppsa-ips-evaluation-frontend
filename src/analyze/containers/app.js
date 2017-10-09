/* eslint-disable react/no-did-mount-set-state */
import autoBind from "react-autobind"
import React from "react"
import Button from "../../shared/components/button"
import SelectCategory from "../../shared/components/selectCategory"
import { getExperiments } from "../../shared/actions/experimentsActions"


export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: [],
      selectedExperiment: null,
      loaded: false
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
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
          <Button
            onClick={ () => this.onSelectExperiment({ name: null }) }>
            Select Other Experiment
          </Button>
        }
      </div>
    )
  }

  onSelectExperiment(experiment) {
    this.setState({ selectedExperiment: experiment.name })
  }
}
