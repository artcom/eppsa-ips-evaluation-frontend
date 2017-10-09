/* eslint-disable react/no-did-mount-set-state */
import autoBind from "react-autobind"
import React from "react"
import SelectCategory from "../../shared/components/selectCategory"
import { getExperiments } from "../../shared/actions/experimentsActions"


export default class App extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: [],
      selectedExperiment: null
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }

  render() {
    return <SelectCategory
      title="Select Experiment:"
      categories={ this.state.experiments }
      onSelect={ this.onSelectExperiment } />
  }

  onSelectExperiment(experiment) {
    this.setState({ selectedExperiment: experiment.name })
  }
}
