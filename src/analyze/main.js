import React from "react"
import { render } from "react-dom"
import config from "../constants"
import App from "./containers/app"


const element = document.getElementById("app")
console.log(`Using backend: ${config.backend}`)
console.log(`Using frontend: ${config.frontend}`)
render(<App backend={ config.backend } frontend={ config.frontend } />, element)
