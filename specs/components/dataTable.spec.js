import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import sinon from "sinon"
import { slice } from "lodash"
import { shallow, mount } from "enzyme"
import Button from "../../src/setUp/components/button"
import DataTable from "../../src/setUp/components/dataTable"


describe("DataTable component", () => {
  it("is a table", () => {
    const headers = ["field1", "field2"]
    expect(shallow(<DataTable headers={ headers } />)
      .type()).to.equal("table")
  })

  it("has the expected headers", () => {
    const headers = ["field1", "field2"]
    const table = shallow(<DataTable headers={ headers } />)
    const headerRow = table.find("tr").at(0)
    expect(headerRow.find("th")).to.have.length(2)
    expect(headerRow.find("th").map(header => header.text())).to.deep.equal(headers)
  })

  it("contains the expected data", () => {
    const headers = ["field1", "field2"]
    const data = [[1, 2], [3, 4]]
    const table = shallow(<DataTable headers={ headers } data={ data } />)
    const tableData = slice(table.find("tr").map(row => row.find("td").map(data => data.text())), 1)
    expect(tableData.map(r => slice(r, 0, r.length - 1).map(d => Number(d)))).to.deep.equal(data)
  })

  it("contains a delete button for each data point", () => {
    const headers = ["field1", "field2"]
    const data = [[1, 2], [3, 4]]
    const table = shallow(<DataTable headers={ headers } data={ data } />)
    const tableDeleteButtons = slice(table.find("tr").map(row => row.find(Button)), 1)
    expect(tableDeleteButtons.map(button => button.childAt(0).text()))
      .to.deep.equal(new Array(2).fill("Delete"))
  })

  it("calls delete function with the expected arguments", () => {
    const headers = ["field1", "field2"]
    const data = [[1, 2], [3, 4]]
    const deleteSpy = sinon.spy()
    const table = mount(<DataTable headers={ headers } data={ data } onDelete={ deleteSpy } />)
    const firstDeleteButton = table.find(Button).at(0)
    firstDeleteButton.simulate("click")
    sinon.assert.calledOnce(deleteSpy)
    sinon.assert.calledWith(deleteSpy, { field1: 1, field2: 2 })
  })
})
