/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import Form from "../components/form"
import Title from "../components/title"
import { getNodes, setNode } from "../actions/nodesActions"


export default class Points extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      nodes: [],
      loaded: false,
      showForm: false
    }
  }

  async componentDidMount() {
    const nodes = await getNodes({ backend: this.props.backend })
    this.setState({ nodes, loaded: true })
  }

  render() {
    const headers = ["id", "name", "type"]
    const types = ["text", "text", "text"]
    const fields = headers.map((header, i) => ({ name: header, type: types[i] }))
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
          this.state.showForm &&
          <Form
            fields={ fields }
            set={ setNode }
            paramName="node"
            onSubmitted={ this.onSubmitted } />
        }
        {
          this.state.loaded && <Button onClick={ this.onCreateNode } >Add Node</Button>
        }
      </div>
    )
  }

  onCreateNode() {
    this.setState({ showForm: true })
  }

  async onSubmitted() {
    this.setState({ showForm: false })
    const nodes = await getNodes({ backend: this.props.backend })
    this.setState({ nodes })
  }
}
