import React from "react"
import { describe, it } from "mocha"
import { expect } from "chai"
import { shallow, mount } from "enzyme"
import Button from "../../src/setUp/components/button"
import Form from "../../src/setUp/components/form"
import Run from "../../src/setUp/containers/run"
import Title from "../../src/setUp/components/title"
import { activateOnSelect, showForm } from "../helpers/paramsHelpers"


describe("Run", () => {
  describe("contains", () => {
    it("a title", () => {
      const run = shallow(<Run title="Run Title" />)
      const title = run.find(Title)
      expect(title).to.have.length(1)
      expect(title.childAt(0).text()).to.equal("Run Title")
    })

    it("a set up button", () => {
      const run = shallow(<Run title="Run Title" />)
      const setUpButton = run.find(Button)
        .filterWhere(button => button.childAt(0).text() === "Set Up")
      expect(setUpButton).to.have.length(1)
    })
  })

  describe("does", () => {
    it("sets showForm state to true when create param button is pushed", done => {
      const run = mount(<Run title="Run Title" />)
      activateOnSelect(run, "showForm", "Set Up", done)
    })

    it("displays a set up form when create param button is pushed", done => {
      const run = mount(<Run title="Run Title" />)
      showForm(run, Form, "Set Up", done)
    })
  })
})
