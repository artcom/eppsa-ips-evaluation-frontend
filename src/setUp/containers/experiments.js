/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import Form from "../components/form"
import Title from "../components/title"
import { getExperiments, deleteExperiment, setExperiment } from "../actions/experimentsActions"


export default class Experiments extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: [],
      loaded: false,
      showForm: false
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments, loaded: true })
  }

  render() {
    const headers = ["name"]
    const data = this.state.experiments.map(experiment => [experiment.name])
    const fields = [{ name: "name", type: "text" }]
    return <div>
      <Title>Experiments:</Title>
      <DataTable headers={ headers } data={ data } onDelete={ this.onDelete } />
      {
        this.state.showForm &&
        <Form
          fields={ fields }
          set={ setExperiment }
          paramName="experiment"
          onSubmitted={ this.onSubmitted } />
      }
      {
        this.state.loaded && <Button onClick={ this.onCreateExperiment }>Create Experiment</Button>
      }
    </div>
  }

  onCreateExperiment() {
    this.setState({ showForm: true })
  }

  async onSubmitted() {
    this.setState({ showForm: false })
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }

  async onDelete(experimentData) {
    await deleteExperiment({ backend: this.props.backend, experimentName: experimentData[0] })
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }
}
