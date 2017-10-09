import Button from "../../src/setUp/components/button"
import { InputField, InputLabel } from "../../src/setUp/components/input"
import Select from "../../src/setUp/components/select"


export function findInputField(form, fieldName) {
  const inputField = form
    .find(InputLabel)
    .filterWhere(field => field.text() === fieldName)
    .find(InputField)
  if (inputField.length === 1) {
    return inputField
  } else {
    return form
      .find(Select)
      .filterWhere(field => field.props().name === fieldName)
  }
}

export function findButtonByName(mountedComponent, name) {
  return mountedComponent
    .find(Button)
    .filterWhere(button => button.text() === name)
}
