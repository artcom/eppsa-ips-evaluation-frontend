/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import Experiment from "../components/experiment"
import ExperimentForm from "../components/experimentForm"
import Title from "../components/title"
import { getExperiments, deleteExperiment } from "../actions/experimentsActions"


export default class Experiments extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: [],
      loaded: false,
      showExperimentForm: false
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
    const fields = [{ name: "name", type: "text" }]
    return <div>
      <Title>Experiments:</Title>
      {
        this.state.experiments.map((experiment, i) =>
          <Experiment key={ i } name={ experiment.name } onDelete={ this.onDelete } />
        )
      }
      {
        this.state.showExperimentForm
        && <ExperimentForm fields={ fields } onSubmitted={ this.onSubmitted } />
      }
      {
        this.state.loaded && <Button onClick={ this.onCreateExperiment }>Create Experiment</Button>
      }
    </div>
  }

  onCreateExperiment() {
    this.setState({ showExperimentForm: true })
  }

  async onSubmitted() {
    this.setState({ showExperimentForm: false })
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }

  async onDelete(experimentName) {
    await deleteExperiment({ backend: this.props.backend, experimentName })
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }
}
