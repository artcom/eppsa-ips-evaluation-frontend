import { InputField, InputLabel } from "../../src/setUp/components/input"


export function findInputField(form, fieldName) {
  return form
    .find(InputLabel)
    .filterWhere(field => field.text() === fieldName)
    .find(InputField)
}
