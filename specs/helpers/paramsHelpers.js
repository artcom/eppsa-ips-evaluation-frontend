import { expect } from "chai"
import { mount } from "enzyme"
import { slice } from "lodash"
import React from "react"
import sinon from "sinon"
import DataTable from "../../src/setUp/components/dataTable"
import { findButtonByName } from "./findElements"
import inputData from "../helpers/inputData"
import Title from "../../src/setUp/components/title"


export function hasTitle(shallowComponent, title) {
  expect(shallowComponent.find(Title)).to.have.length(1)
  expect(shallowComponent.find(Title).childAt(0).text()).to.equal(title)
}

export function hasTable(mountedComponent, headers) {
  expect(mountedComponent.find(DataTable)).to.have.length(1)
  const tableHeaders = mountedComponent
    .find(DataTable).at(0)
    .find("tr").at(0)
    .find("th").map(header => header.text())
  expect(tableHeaders).to.deep.equal(headers)
}

export function callsMountFunctions(Component, props, getMock, callArgs) {
  const componentDidMount = sinon.spy(Component.prototype, "componentDidMount")
  const mountedComponent = mount(<Component { ...props } />)
  expect(JSON.stringify(mountedComponent.props())).to.deep.equal(JSON.stringify(props))
  expect(Component.prototype.componentDidMount.calledOnce).to.equal(true)
  sinon.assert.calledOnce(getMock)
  sinon.assert.calledWith(getMock, callArgs)
  componentDidMount.restore()
}

export function storeDataInState(mountedComponent, getMock, stateKey, data, done) {
  expect(mountedComponent.state(stateKey)).to.deep.equal([])
  sinon.assert.calledOnce(getMock)
  setImmediate(() => {
    const storedPoints = JSON.stringify(mountedComponent.state(stateKey))
    const expectedPoints = JSON.stringify(data)
    expect(storedPoints).to.equal(expectedPoints)
    done()
  })
}

export function displayInTable(mountedComponent, dataState, expectedRows) {
  mountedComponent.setState(dataState)
  const displayedData = mountedComponent
    .find(DataTable).at(0)
    .find("tr")
    .map(row => row.find("td").map(data => data.text()))
  expect(slice(displayedData, 1)).to.deep.equal(expectedRows)
}

export function acknowledgeRetrieval(mountedComponent, getMock, done) {
  expect(mountedComponent.state("loaded")).to.equal(false)
  sinon.assert.calledOnce(getMock)
  setImmediate(() => {
    expect(mountedComponent.state("loaded")).to.equal(true)
    done()
  })
}

export function activateOnSelect(mountedComponent, stateKey, buttonName, done) {
  expect(mountedComponent.state(stateKey)).to.equal(false)
  setImmediate(() => {
    findButtonByName(mountedComponent, buttonName).simulate("click")
    expect(mountedComponent.state(stateKey)).to.equal(true)
    done()
  })
}

export function showForm(mountedComponent, FormComponent, buttonName, done) {
  setImmediate(() => {
    expect(mountedComponent.find(FormComponent)).to.have.length(0)
    findButtonByName(mountedComponent, buttonName).simulate("click")
    expect(mountedComponent.find(FormComponent)).to.have.length(1)
    done()
  })
}

export function activateForm(mountedComponent, FormComponent, buttonName, data) {
  expect(mountedComponent.find(FormComponent)).to.have.length(0)
  findButtonByName(mountedComponent, buttonName).simulate("click")
  expect(mountedComponent.find(FormComponent)).to.have.length(1)
  inputData(mountedComponent.find(FormComponent), data)
}

export function submitData(
  mountedComponent,
  FormComponent,
  buttonName,
  data,
  setMock,
  callArgs,
  done
) {
  setImmediate(() => {
    activateForm(mountedComponent, FormComponent, buttonName, data)
    mountedComponent.find(FormComponent).simulate("submit")
    sinon.assert.calledOnce(setMock)
    sinon.assert.calledWith(setMock, callArgs)
    done()
  })
}

export function hideForm(
  mountedComponent,
  FormComponent,
  data,
  stateKey,
  buttonName,
  setMock,
  done
) {
  setImmediate(() => {
    activateForm(mountedComponent, FormComponent, buttonName, data)
    mountedComponent.find(FormComponent).simulate("submit")
    sinon.assert.calledOnce(setMock)
    setImmediate(() => {
      expect(mountedComponent.state(stateKey)).to.equal(false)
      expect(mountedComponent.find(FormComponent)).to.have.length(0)
      done()
    })
  })
}

export function reloadData(
  mountedComponent,
  FormComponent,
  stateKey,
  setMock,
  getMock,
  newData,
  done
) {
  mountedComponent.find(FormComponent).simulate("submit")
  sinon.assert.calledOnce(setMock)
  setImmediate(() => {
    sinon.assert.calledOnce(getMock)
    const storedData = JSON.stringify(mountedComponent.state(stateKey))
    const expectedData = JSON.stringify(newData)
    expect(storedData).to.equal(expectedData)
    done()
  })
}

export function callDeleteData(mountedComponent, deleteMock, callArgs, done) {
  setImmediate(() => {
    expect(mountedComponent.find("tbody").find("tr"))
      .to.have.length(2)
    const point1Row = mountedComponent.find("tbody").find("tr").at(0)
    findButtonByName(point1Row, "Delete").simulate("click")
    sinon.assert.calledOnce(deleteMock)
    sinon.assert.calledWith(deleteMock, callArgs)
    done()
  })
}
