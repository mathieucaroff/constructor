import "antd/dist/antd.css"

import React, { ReactNode, useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { Input, List, PageHeader, Switch, Table } from "antd"
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
    let [showTitles, setShowTitles] = useState(false)
    let [badInput, setBadInput] = useState("")

    let primeObject = useMemo(() => {
        return primeLib.getPrimeExponentObject(target)
    }, [target])

    let repetitionList = [] as string[]
    let representationList = [] as string[]
    let visualList = [] as ReactNode[]
    let shortList = [] as string[]

    Object.entries(primeObject).map(([prime, exponent]) => {
        repetitionList.push(...Array(Number(exponent)).fill(prime))
        shortList.push(`${(+prime) ** exponent}`)
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
        shortList[0] = "-" + shortList[0]
    } else if (target < 2) {
        repetitionList.push(`${target}`)
        representationList.push(`${target}`)
        visualList.push(<span key={"" + target}>{"" + target}</span>)
        shortList.push(`${target}`)
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
            <label style={{ fontSize: "small", margin: "10px" }}>Show Line Titles</label>
            <Switch
                checked={showTitles}
                onClick={() => {
                    setShowTitles(!showTitles)
                }}
            />
            {badInput ? (
                <em>
                    <br />
                    {badInput}
                </em>
            ) : null}

            <Table
                columns={[
                    ...(showTitles ? [{ dataIndex: "title", width: 300 }] : []),
                    { dataIndex: "value", render: (text) => <code>{text}</code> },
                ]}
                dataSource={[
                    { title: "Repeating prime", value: repetitionList.join(" * ") },
                    {
                        title: "Prime power exponent",
                        value: representationList.join(" * "),
                    },
                    {
                        title: "Prime and exponent",
                        value: visualList,
                    },
                    {
                        title: "Power result",
                        value: shortList.join(" * "),
                    },
                ]}
                showHeader={false}
                pagination={{ position: [] }}
            />
        </div>
    )
}

main()
