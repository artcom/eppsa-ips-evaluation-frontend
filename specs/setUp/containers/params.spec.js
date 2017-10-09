/* eslint-disable  import/no-commonjs */
import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { concat } from "lodash"
import sinon from "sinon"
import { mount, shallow } from "enzyme"
import config from "../../../src/constants"
import Button from "../../../src/shared/components/button"
import Params from "../../../src/setUp/containers/params"
import Form from "../../../src/setUp/components/form"
import {
  acknowledgeRetrieval,
  activateForm,
  activateOnSelect,
  callDeleteData,
  callsMountFunctions,
  deleteData,
  displayInTable,
  hasTable,
  hasTitle,
  hideForm,
  reloadData,
  showForm,
  storeDataInState,
  submitData
} from "../../helpers/paramsHelpers"
import { checkProps } from "../../helpers/propsHelpers"

describe("Params", () => {
  const backend = config.backend

  describe("contains", () => {
    it("a title", () => {
      hasTitle(shallow(<Params title="Params:" fields={ [] } />), "Params:")
    })

    it("a table with the expected headers", () => {
      const headers = ["field1", "field2"]
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const getStub = sinon.stub().resolves([])
      const params = mount(<Params fields={ fields } get={ getStub } />)
      hasTable(params, headers)
    })

    it("no create param button when loaded state is false", () => {
      const params = shallow(<Params fields={ [] } get={ a => a } />)
      expect(params.state("loaded")).to.equal(false)
      expect(params.find(Button)).to.have.length(0)
    })

    it("a create param button when loaded state is true", () => {
      const params = shallow(<Params createText="Create Param" fields={ [] } />)
      params.setState({ loaded: true })
      expect(params.find(Button)).to.have.length(1)
      expect(params.find(Button).childAt(0).text()).to.equal("Create Param")
    })
  })

  describe("for retrieval", () => {
    it("calls componentDidMount and get functions", () => {
      const getStub = sinon.stub().resolves([])
      callsMountFunctions(Params, { backend, fields: [], get: getStub }, getStub, { backend })
    })

    it("stores params retrieved from the backend in state", done => {
      const data = [{ field1: "value1", field2: "value2" }, { field1: "value3", field2: "value4" }]
      const getStub = sinon.stub().resolves(data)
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params backend={ backend } fields={ fields } get={ getStub } />
      )
      storeDataInState(params, getStub, "data", data, done)
    })

    it("renders params that are present in state", () => {
      const data = [{ field1: "value1", field2: "value2" }, { field1: "value3", field2: "value4" }]
      const getStub = sinon.stub().resolves(data)
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params backend={ backend } fields={ fields } get={ getStub } delete={ a => a } />
      )
      const expectedRows = [["value1", "value2", "Delete"], ["value3", "value4", "Delete"]]
      displayInTable(params, { data }, expectedRows)
    })

    it("renders params that are present in state with no delete button when delete is not defined",
      () => {
        const data = [
          { field1: "value1", field2: "value2" },
          { field1: "value3", field2: "value4" }
        ]
        const getStub = sinon.stub().resolves(data)
        const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
        const params = mount(
          <Params backend={ backend } fields={ fields } get={ getStub } />
        )
        const expectedRows = [["value1", "value2"], ["value3", "value4"]]
        displayInTable(params, { data }, expectedRows)
      }
    )

    it("sets loaded state to true when params have been retrieved from the backend", done => {
      const getStub = sinon.stub().resolves([])
      const params = mount(<Params backend={ backend } fields={ [] } get={ getStub } />)
      acknowledgeRetrieval(params, getStub, done)
    })
  })

  describe("for creation", () => {
    it("sets showForm state to true when create param button is pushed", done => {
      const getStub = sinon.stub().resolves([])
      const params = mount(
        <Params
          backend={ backend }
          fields={ [] }
          get={ getStub }
          createText="Create Param" />)
      activateOnSelect(params, "showForm", "Create Param", done)
    })

    it("displays a param form when create param button is pushed", done => {
      const getStub = sinon.stub().resolves([])
      const params = mount(
        <Params
          backend={ backend }
          fields={ [] }
          get={ getStub }
          createText="Create Param" />)
      showForm(params, Form, "Create Param", done)
    })

    it("passes the expected props to the param form", () => {
      const getStub = sinon.stub().resolves([])
      const set = a => a
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const paramsProps = {
        backend,
        fields,
        get: getStub,
        set,
        paramName: "param",
        createText: "Create Param"
      }
      const formProps = { fields, set, paramName: "param", submitName: "Create" }
      const params = mount(<Params { ...paramsProps } />)
      params.setState({ showForm: true })
      const form = params.find(Form)
      checkProps({ mountedComponent: form, props: formProps })
    })

    it("submits new param to backend when filled form is submitted", done => {
      const getStub = sinon.stub().resolves([])
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params
          backend={ backend }
          fields={ fields }
          get={ getStub }
          set={ setStub }
          paramName="param"
          createText="Create Param" />)
      const submitParam = { field1: "value1", field2: "value2" }
      const callArgs = { backend, param: submitParam }
      submitData(
        params,
        Form,
        "Create Param",
        submitParam,
        setStub,
        callArgs,
        done
      )
    })

    it("submits new param to backend when filled form is submitted and experiment prop is set",
      done => {
        const getStub = sinon.stub().resolves([])
        const setStub = sinon.stub().resolves("")
        const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
        const params = mount(
          <Params
            backend={ backend }
            fields={ fields }
            get={ getStub }
            set={ setStub }
            paramName="param"
            experimentName="fake-experiment"
            createText="Create Param" />)
        const submitParam = { field1: "value1", field2: "value2" }
        const callArgs = { backend, param: submitParam, experimentName: "fake-experiment" }
        submitData(
          params,
          Form,
          "Create Param",
          submitParam,
          setStub,
          callArgs,
          done
        )
      }
    )

    it("hides experiment form when onSubmitted is called", done => {
      const getStub = sinon.stub().resolves([])
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params
          backend={ backend }
          fields={ fields }
          get={ getStub }
          set={ setStub }
          paramName="param"
          createText="Create Param" />)
      const submitParam = { field1: "value1", field2: "value2" }
      hideForm(
        params,
        Form,
        submitParam,
        "showForm",
        "Create Param",
        setStub,
        done
      )
    })

    it("reloads params when onSubmitted is called", done => {
      const initialData = [{ field1: "value1", field2: "value2" }]
      const submitParam = { field1: "value1", field2: "value2" }
      const newData = concat(initialData, [submitParam])
      const getStub = sinon.stub()
      getStub.onFirstCall().resolves(initialData)
      getStub.onSecondCall().resolves(newData)
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params
          backend={ backend }
          fields={ fields }
          get={ getStub }
          set={ setStub }
          paramName="param"
          createText="Create Param" />)
      setImmediate(() => {
        activateForm(params, Form, "Create Param", submitParam)
        reloadData(params, Form, "data", setStub, getStub, newData, done)
      })
    })
  })

  describe("for deletion", () => {
    it("calls deleteParam when delete button is pushed", done => {
      const data = [{ field1: "value1", field2: "value2" }, { field1: "value3", field2: "value4" }]
      const deleteSpy = sinon.spy()
      const getStub = sinon.stub().resolves(data)
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params
          backend={ backend }
          fields={ fields }
          get={ getStub }
          set={ setStub }
          delete={ deleteSpy }
          paramName="param"
          createText="Create Param" />)
      const deleteArgs = { backend, param: { field1: "value1", field2: "value2" } }
      callDeleteData(params, deleteSpy, deleteArgs, done)
    })

    it("reloads params when an param is deleted", done => {
      const data = [{ field1: "value1", field2: "value2" }, { field1: "value3", field2: "value4" }]
      const deleteSpy = sinon.spy()
      const getStub = sinon.stub()
      getStub.onFirstCall().resolves(data)
      getStub.onSecondCall().resolves([data[1]])
      const setStub = sinon.stub().resolves("")
      const fields = [{ name: "field1", type: "text" }, { name: "field2", type: "text" }]
      const params = mount(
        <Params
          backend={ backend }
          fields={ fields }
          get={ getStub }
          set={ setStub }
          delete={ deleteSpy }
          paramName="param"
          createText="Create Param" />)
      setImmediate(() => {
        deleteData(params, "data", [data[1]], done)
      })
    })
  })
})
