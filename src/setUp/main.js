import React from "react"
import { render } from "react-dom"
import { backend } from "../constants"
import Experiments from "./containers/experiments"


const element = document.getElementById("app")
render(<Experiments backend={ backend } />, element)
