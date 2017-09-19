import React from "react"
import autoBind from "react-autobind"
import Button from "../components/button"
import Form from "../components/form"
import Title from "../components/title"


export default class Run extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
    this.state = {
      showForm: false
    }
  }

  render() {
    const { title } = this.props
    const fields = [
      { name: "experimentTypes" },
      { name: "repeats", type: "number" },
      { name: "interval", type: "number" }
    ]
    return (
      <div>
        <Title>{ title }</Title>
        {
          this.state.showForm &&
            <Form fields={ fields } />
        }
        <Button onClick={ this.onSetUp }>Set Up</Button>
      </div>
    )
  }

  onSetUp() {
    this.setState({ showForm: true })
  }
}
