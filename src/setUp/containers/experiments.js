/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import Experiment from "../components/experiment"
import Title from "../components/title"
import { getExperiments } from "../actions/getExperiments"


export default class Experiments extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: []
    }
  }

  async componentDidMount() {
    const experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ experiments })
  }

  render() {
    return <div>
      <Title>Experiments:</Title>
      {
        this.state.experiments.map((experiment, i) =>
          <Experiment key={ i }>{ experiment.name }</Experiment>
        )
      }
      <Button>Create Experiment</Button>
    </div>
  }
}
