import Button from "../../src/setUp/components/button"
import { InputField, InputLabel } from "../../src/setUp/components/input"


export function findInputField(form, fieldName) {
  return form
    .find(InputLabel)
    .filterWhere(field => field.text() === fieldName)
    .find(InputField)
}

export function findButtonByName(mountedComponent, name) {
  return mountedComponent
    .find(Button)
    .filterWhere(button => button.text() === name)
}
