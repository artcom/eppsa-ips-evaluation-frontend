import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow } from "enzyme"
import DataTable from "../../src/setUp/components/dataTable"


describe("DataTable component", () => {
  it("is a table", () => {
    const headers = ["name", "X", "Y", "Z"]
    expect(shallow(<DataTable headers={ headers } />)
      .type()).to.equal("table")
  })

  it("has the expected headers", () => {
    const headers = ["name", "X", "Y", "Z"]
    const table = shallow(<DataTable headers={ headers } />)
    const headerRow = table.find("tr").at(0)
    expect(headerRow.find("th")).to.have.length(4)
    expect(headerRow.find("th").map(header => header.text())).to.deep.equal(headers)
  })
})
