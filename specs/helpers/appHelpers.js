import Form from "../../src/setUp/components/form"
import Params from "../../src/setUp/containers/params"
import { findButtonByName } from "./findElements"
import inputData from "./inputData"


export function addParam({ mountedComponent, paramName, experiment, createText, data }) {
  const specificParams = experiment
    ? mountedComponent
      .find(Params)
      .filterWhere(params =>
        params.props().paramName === paramName
        && params.props().experiment === experiment
      )
    : mountedComponent
      .find(Params)
      .filterWhere(params => params.props().paramName === paramName)
  findButtonByName(specificParams, createText).simulate("click")
  const form = specificParams.find(Form)
  inputData(form, data)
  form.simulate("submit")
}
