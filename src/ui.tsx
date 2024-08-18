import { ReactNode, useMemo, useState } from "react"
import { Checkbox } from "./checkbox"
import { createConstructor } from "./constructor"
import { Input } from "./input"
import { Operation } from "./type"
import { resolveMath } from "./util"

function catchToReactText(f: () => ReactNode) {
  try {
    return f()
  } catch (e) {
    return <em>{String(e)}</em>
  }
}

export function UserInterface() {
  let [target, setTarget] = useState("0")
  let [operationSet, setOperationSet] = useState(() => ({} as Record<Operation, boolean>))
  let [baseString, setBaseString] = useState("1 2")
  let [mathString, setMathString] = useState("0")
  let solutionArray = useMemo(
    () =>
      createConstructor(
        operationSet,
        baseString
          .split(/\s+/)
          .filter((x) => x)
          .map((x) => Number(x) || 2),
        Number(target) || 0,
      ).obtain() || [],
    [operationSet, baseString, target],
  )
  return (
    <div>
      {["add", "multiply", "subtract", "divide", "remainder", "exponent"].map((operationName) => (
        <label key={operationName}>
          <Checkbox
            name={`operation.${operationName}`}
            setValue={(checked) => {
              setOperationSet((set) => ({ ...set, [operationName]: Boolean(checked) }))
            }}
          />
          {operationName}
        </label>
      ))}
      <Input name="base" setValue={setBaseString} />
      <Input
        name="target"
        setValue={(value) => {
          if (!Number.isNaN(Number(value))) {
            setTarget(value)
          }
        }}
      />
      <ul>
        {solutionArray.slice(0, 6).map((solution, k) => (
          <li key={k}>
            {solution.math.map((v) => String(v)).join(" ")} [complexity={solution.complexity}]
          </li>
        ))}
      </ul>
      <Input
        name="math"
        setValue={(value) => {
          if (value.trim().length > 0) {
            setMathString(value.trim())
          }
        }}
      />
      {catchToReactText(() =>
        resolveMath(
          mathString.split(" ").map((x) => {
            const num = Number(x)
            if (!Number.isNaN(num)) {
              return num
            }
            return x as Operation
          }),
        ),
      )}
    </div>
  )
}
