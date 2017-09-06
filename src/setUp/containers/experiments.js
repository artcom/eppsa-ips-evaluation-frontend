import React from "react"
import autoBind from "react-autobind"
import Experiment from "../components/experiment"
import { getExperiments } from "../actions/getExperiments"


export default class Experiments extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      experiments: []
    }
  }

  componentDidMount() {
    getExperiments({ backend: this.props.backend })
      .then(experiments => this.setState({ experiments }))
  }

  render() {
    return <div>
      {
        this.state.experiments.map((experiment, i) =>
          <Experiment experimentName={ experiment.name } key={ i } />
        )
      }
    </div>
  }
}
