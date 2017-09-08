/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import DataTable from "../components/dataTable"
import Title from "../components/title"
import { getPoints } from "../actions/pointsActions"


export default class Points extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      points: [],
      loaded: false
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
      </div>
    )
  }
}
