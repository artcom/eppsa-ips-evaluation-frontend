import React from "react"
import autoBind from "react-autobind"
import Experiment from "../components/experiment"
import getExperiments from "../actions/getExperiments"


export default class Experiments extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      loaded: false
    }
    this.experiments = []
  }
  
  async componentDidMount() {
    this.experiments = await getExperiments({ backend: this.props.backend })
    this.setState({ loaded: true })
  }
  
  render() {
    return(<div>
      {
        this.state.loaded && this.experiments.map((experiment, i) =>
          <Experiment experimentName={ experiment.name } key={ i } />
        )
      }
    </div>)
  }
}
