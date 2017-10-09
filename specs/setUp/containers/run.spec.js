import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import { shallow, mount } from "enzyme"
import config from "../../../src/constants"
import Button from "../../../src/shared/components/button"
import Form from "../../../src/setUp/components/form"
import Run from "../../../src/setUp/containers/run"
import Title from "../../../src/setUp/components/title"
import { activateOnSelect, hideForm, showForm, submitData } from "../../helpers/paramsHelpers"
import { checkProps } from "../../helpers/propsHelpers"


describe("Run", () => {
  const backend = config.backend

  describe("contains", () => {
    it("a title", () => {
      const run = shallow(<Run title="Run Title" />)
      const title = run.find(Title)
      expect(title).to.have.length(1)
      expect(title.childAt(0).text()).to.equal("Run Title")
    })

    it("a set up button", () => {
      const run = shallow(<Run title="Run Title" />)
      const setUpButton = run.find(Button)
        .filterWhere(button => button.childAt(0).text() === "Set Up")
      expect(setUpButton).to.have.length(1)
    })

    it("no set up button when set up form is showing", () => {
      const run = shallow(<Run title="Run Title" />)
      run.setState({ showForm: true })
      const setUpButton = run.find(Button)
        .filterWhere(button => button.childAt(0).text() === "Set Up")
      expect(setUpButton).to.have.length(0)
    })
  })

  describe("does", () => {
    it("sets showForm state to true when create param button is pushed", done => {
      const run = mount(<Run title="Run Title" fields={ [] } />)
      activateOnSelect(run, "showForm", "Set Up", done)
    })

    it("displays a set up form when create param button is pushed", done => {
      const run = mount(<Run title="Run Title" fields={ [] } />)
      showForm(run, Form, "Set Up", done)
    })

    it("passes the expected props to the param form", () => {
      const set = a => a
      const paramName = "run"
      const experimentName = "fake-experiment"
      const fields = [{ name: "field1", type: "checkBox" }, { name: "field2", type: "text" }]
      const runProps = { title: "Run Title", fields, set, paramName, experimentName }
      const formProps = { fields, set, paramName, experimentName, submitName: "Run" }
      const run = mount(<Run { ...runProps } />)
      run.setState({ showForm: true })
      const form = run.find(Form)
      checkProps({ mountedComponent: form, props: formProps })
    })

    it("submits run parameters to backend when filled form is submitted", done => {
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "checkBox" }, { name: "field2", type: "text" }]
      const run = mount(
        <Run
          title="Run Title"
          fields={ fields }
          set={ setStub }
          paramName="run"
          backend={ backend }
          experimentName="fake-experiment" />
      )
      const submitParam = { field1: true, field2: "value2" }
      const callArgs = { backend, experimentName: "fake-experiment", run: submitParam }
      submitData(
        run,
        Form,
        "Set Up",
        submitParam,
        setStub,
        callArgs,
        done
      )
    })

    it("hides run form when onSubmitted is called", done => {
      const setStub = sinon.stub().resolves([])
      const fields = [{ name: "field1", type: "checkBox" }, { name: "field2", type: "text" }]
      const run = mount(
        <Run
          title="Run Title"
          fields={ fields }
          set={ setStub }
          paramName="run"
          experiment="fake-experiment" />
      )
      const submitParam = { field1: true, field2: "value2" }
      hideForm(
        run,
        Form,
        submitParam,
        "showForm",
        "Set Up",
        setStub,
        done
      )
    })
  })
})
