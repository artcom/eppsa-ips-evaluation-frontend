/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
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
    return (
      <div>
        <Title>Points:</Title>
      </div>
    )
  }
}
