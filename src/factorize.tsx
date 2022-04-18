import "antd/dist/antd.css"

import React, { ReactNode, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { Input, List, PageHeader } from "antd"
import * as primeLib from "./lib/primeLib"
import { githubCornerHTML } from "./lib/githubCorner"
import { repository, version } from "../package.json"

function main() {
    let div = document.createElement("div")
    div.innerHTML = githubCornerHTML(repository.url, version)
    document.body.appendChild(div)

    let title = document.getElementsByClassName("title")[0].textContent
    let subtitle = document.getElementsByClassName("subtitle")[0].textContent

    let titleDiv = document.getElementById("title")!
    titleDiv.parentElement!.removeChild(titleDiv)

    let appRoot = document.getElementById("appRoot")!
    ReactDOM.render(React.createElement(UserInterface, { title, subtitle }), appRoot)
}

function UserInterface(prop) {
    let { title, subtitle } = prop
    let [target, setTarget] = useState(2n)
    let [badInput, setBadInput] = useState("")

    let primeObject = useMemo(() => {
        return primeLib.getPrimeExponentObject(target)
    }, [target])

    let repetitionList = [] as string[]
    let representationList = [] as string[]
    let visualList = [] as ReactNode[]

    Object.entries(primeObject).map(([prime, exponent]) => {
        repetitionList.push(...Array(Number(exponent)).fill(prime))
        if (exponent > 1) {
            representationList.push(`${prime}**${exponent}`)
            visualList.push(
                <span key={prime}>
                    {prime}
                    <sup>{exponent}</sup>{" "}
                </span>,
            )
        } else {
            representationList.push(`${prime}`)
            visualList.push(<span key={prime}>{prime} </span>)
        }
    })
    if (target <= -2) {
        repetitionList[0] = "-" + repetitionList[0]
        representationList[0] = "-" + representationList[0]
        visualList.unshift(<span key={"-"}>{"-"}</span>)
    } else if (target < 2) {
        repetitionList.push(`${target}`)
        representationList.push(`${target}`)
        visualList.push(<span key={"" + target}>{"" + target}</span>)
    }

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.location.assign(".")}
                title={title}
                subTitle={subtitle}
            ></PageHeader>
            <Input
                defaultValue={2}
                onChange={(event) => {
                    let v = event.target.value

                    if (v.length <= 18) {
                        try {
                            setTarget(BigInt(v))
                            setBadInput("")
                        } catch {
                            setBadInput("Invalid number")
                        }
                    } else {
                        setBadInput("The input number cannot be longer than 18 digits")
                    }
                }}
                style={{ width: "300px" }}
            />
            {badInput ? (
                <em>
                    <br />
                    {badInput}
                </em>
            ) : null}
            <List>
                <List.Item>
                    <code>{repetitionList.join(" * ")}</code>
                </List.Item>
                <List.Item>
                    <code>{representationList.join(" * ")}</code>
                </List.Item>
                <List.Item>
                    <div>
                        <code>{visualList}</code>
                    </div>
                </List.Item>
            </List>
        </div>
    )
}

main()
