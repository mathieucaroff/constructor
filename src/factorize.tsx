import "antd/dist/antd.css"

import React, { ReactNode, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { Input, InputNumber, List } from "antd"
import * as primeLib from "./lib/primeLib"

function main() {
    let appRoot = document.getElementById("appRoot")
    ReactDOM.render(React.createElement(UserInterface), appRoot)
}

function UserInterface() {
    let [target, setTarget] = useState(1n)
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

    if (target < 2) {
        repetitionList.push(`${target}`)
        representationList.push(`${target}`)
        visualList.push(<span key={"" + target}>{"" + target}</span>)
    }

    return (
        <div>
            <Input
                onChange={(event) => {
                    let v = event.target.value
                    if (v.length <= 18) {
                        setTarget(BigInt(v))
                        setBadInput("")
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
