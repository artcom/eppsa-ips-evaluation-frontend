import React from "react"
import autoBind from "react-autobind"
import Button from "../../shared/components/button"
import Form from "../../shared/components/form"
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
    const { title, fields, set, paramName, backend, experimentName } = this.props
    return (
      <div>
        <Title>{ title }</Title>
        {
          this.state.showForm &&
            <Form
              fields={ fields }
              set={ set }
              backend={ backend }
              paramName={ paramName }
              experimentName={ experimentName }
              submitName="Run"
              onSubmitted={ this.onSubmitted } />
        }
        {
          !this.state.showForm &&
          <Button onClick={ this.onSetUp }>Set Up</Button>
        }
      </div>
    )
  }

  onSetUp() {
    this.setState({ showForm: true })
  }

  async onSubmitted() {
    this.setState({ showForm: false })
  }
}
