/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import Form from "../components/form"
import Title from "../components/title"
import { getPoints, setPoint } from "../actions/pointsActions"


export default class Points extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      points: [],
      loaded: false,
      showForm: false
    }
  }

  async componentDidMount() {
    const points = await getPoints({ backend: this.props.backend })
    this.setState({ points, loaded: true })
  }

  render() {
    const headers = ["name", "X", "Y", "Z"]
    const types = ["text", "text", "text", "text"]
    const fields = headers.map((header, i) => ({ name: header, type: types[i] }))
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
          this.state.showForm &&
          <Form
            fields={ fields }
            set={ setPoint }
            paramName="point"
            processData={ processData }
            onSubmitted={ this.onSubmitted } />
        }
        {
          this.state.loaded && <Button onClick={ this.onCreatePoint } >Add Point</Button>
        }
      </div>
    )
  }

  onCreatePoint() {
    this.setState({ showForm: true })
  }

  async onSubmitted() {
    this.setState({ showForm: false })
    const points = await getPoints({ backend: this.props.backend })
    this.setState({ points })
  }
}

function processData(data) {
  return {
    backend: data.backend,
    point: {
      name: data.point.name,
      trueCoordinateX: data.point.X,
      trueCoordinateY: data.point.Y,
      trueCoordinateZ: data.point.Z
    }
  }
}
