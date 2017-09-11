/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import NodeForm from "../components/nodeForm"
import Title from "../components/title"
import { getNodes } from "../actions/nodesActions"


export default class Points extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      nodes: [],
      loaded: false,
      showNodeForm: false
    }
  }

  async componentDidMount() {
    const nodes = await getNodes({ backend: this.props.backend })
    this.setState({ points: nodes, loaded: true })
  }

  render() {
    const headers = ["id", "name", "type"]
    const data = this.state.nodes.map(node => [
      node.id,
      node.name,
      node.type
    ])

    return (
      <div>
        <Title>Nodes:</Title>
        <DataTable headers={ headers } data={ data } />
        {
          this.state.showNodeForm && <NodeForm onSubmitted={ this.onSubmitted } />
        }
        {
          this.state.loaded && <Button onClick={ this.onCreateNode } >Add Node</Button>
        }
      </div>
    )
  }

  onCreateNode() {
    this.setState({ showNodeForm: true })
  }

  async onSubmitted() {
    this.setState({ showNodeForm: false })
    const nodes = await getNodes({ backend: this.props.backend })
    this.setState({ points: nodes })
  }
}
