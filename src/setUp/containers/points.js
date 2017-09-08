/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import PointForm from "../components/pointForm"
import Title from "../components/title"
import { getPoints } from "../actions/pointsActions"


export default class Points extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      points: [],
      loaded: false,
      showPointForm: false
    }
  }

  async componentDidMount() {
    const points = await getPoints({ backend: this.props.backend })
    this.setState({ points, loaded: true })
  }

  render() {
    const headers = ["name", "X", "Y", "Z"]
    const data = this.state.points.map(point => [
      point.name,
      point.trueCoordinateX,
      point.trueCoordinateY,
      point.trueCoordinateZ
    ])

    return (
      <div>
        <Title>Points:</Title>
        <DataTable headers={ headers } data={ data } />
        {
          this.state.showPointForm && <PointForm />
        }
        {
          this.state.loaded && <Button onClick={ this.onCreatePoint } >Add Point</Button>
        }
      </div>
    )
  }

  onCreatePoint() {
    this.setState({ showPointForm: true })
  }
}
