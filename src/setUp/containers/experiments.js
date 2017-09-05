import React from "react"
import autoBind from "react-autobind"
import Experiment from "../components/experiment"
import getExperiments from "../actions/getExperiments"


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
    return(<div>
      {
        this.state.experiments.map((experiment, i) =>
          <Experiment experimentName={ experiment.name } key={ i } />
        )
      }
    </div>)
  }
}
