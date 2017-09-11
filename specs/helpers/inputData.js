import { keys } from "lodash"
import { findInputField } from "./findElements"

export default function inputData(form, data) {
  for (const key of keys(data)) {
    findInputField(form, key)
      .simulate("change", { target: { value: data[key] } })
  }
}
