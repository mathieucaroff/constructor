import "@picocss/pico"

import React from "react"
import ReactDOM from "react-dom"
import { githubCornerHTML } from "./lib/githubCorner"
import { repository, version } from "../package.json"
import { UserInterface } from "./ui"

function main() {
    let div = document.createElement("div")
    div.innerHTML = githubCornerHTML(repository.url, version)
    document.body.appendChild(div)

    let appRoot = document.getElementById("appRoot")!
    ReactDOM.render(React.createElement(UserInterface), appRoot)
}

main()
