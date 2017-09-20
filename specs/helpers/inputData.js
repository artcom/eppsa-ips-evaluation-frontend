import { keys } from "lodash"
import { findInputField } from "./findElements"

export default function inputData(form, data) {
  for (const key of keys(data)) {
    const inputField = findInputField(form, key)
    if (inputField.props().type === "checkBox") {
      findInputField(form, key)
        .simulate("change", { target: { checked: data[key] } })
    } else {
      findInputField(form, key)
        .simulate("change", { target: { value: data[key] } })
    }
  }
}
