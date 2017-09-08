import React from "react"
import { render } from "react-dom"
import { backend } from "../constants"
import App from "./containers/app"


const element = document.getElementById("app")
render(<App backend={ backend } />, element)
