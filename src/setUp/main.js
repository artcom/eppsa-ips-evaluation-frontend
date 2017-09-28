import React from "react"
import { render } from "react-dom"
import config from "../constants"
import App from "./containers/app"


const element = document.getElementById("app")
console.log(`Using backend: ${config.backend}`)
render(<App backend={ config.backend } />, element)
