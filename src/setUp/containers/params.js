/* eslint-disable react/no-did-mount-set-state */
import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import DataTable from "../components/dataTable"
import Form from "../components/form"
import Title from "../components/title"


export default class Params extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.mounted = false
    this.state = {
      data: [],
      loaded: false,
      showForm: false
    }
  }

  async componentDidMount() {
    this.mounted = true
    const getArgs = this.props.experiment
      ? { backend: this.props.backend, experimentName: this.props.experiment }
      : { backend: this.props.backend }
    const data = await this.props.get(getArgs)
    if (this.mounted) {
      this.setState({ data, loaded: true })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { title, fields, createText, set, paramName } = this.props
    const headers = fields.map(field => field.name)
    const data = this.state.data.map(datum => headers.map(header => datum[header]))
    return <div>
      <Title>{ title }</Title>
      <DataTable
        headers={ headers }
        data={ data }
        onDelete={ this.props.delete && this.onDelete } />
      {
        this.state.showForm &&
        <Form
          fields={ fields }
          set={ set }
          paramName={ paramName }
          experiment={ this.props.experiment }
          onSubmitted={ this.onSubmitted } />
      }
      {
        this.state.loaded && <Button onClick={ this.onCreate }>{ createText }</Button>
      }
    </div>
  }

  onCreate() {
    this.setState({ showForm: true })
  }

  async onSubmitted() {
    this.setState({ showForm: false })
    const getArgs = this.props.experiment
      ? { backend: this.props.backend, experimentName: this.props.experiment }
      : { backend: this.props.backend }
    const data = await this.props.get(getArgs)
    this.setState({ data })
  }

  async onDelete(deleteData) {
    const deleteArgs = { backend: this.props.backend }
    deleteArgs[this.props.paramName] = deleteData
    await this.props.delete(deleteArgs)
    const data = await this.props.get({ backend: this.props.backend })
    this.setState({ data })
  }
}
