import { expect } from "chai"
import { keys } from "lodash"


export function checkProps({ mountedComponent, props, copy = false }) {
  for (const key of keys(props)) {
    if (copy) {
      expect(JSON.stringify(mountedComponent.props()[key])).to.equal(JSON.stringify(props[key]))
    } else {
      expect(mountedComponent.props()[key]).to.equal(props[key])
    }
  }
}
