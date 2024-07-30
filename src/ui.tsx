import { useMemo, useState } from "react"
import { createConstructor } from "./constructor"
import { Input } from "./input"
import { Operation } from "./type"
import { Checkbox } from "./checkbox"
import { resolveMath } from "./util"

export function UserInterface() {
  let [target, setTarget] = useState("0")
  let [operationSet, setOperationSet] = useState({ add: true } as Record<Operation, boolean>)
  let [baseString, setBaseString] = useState("1 2")
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
              setOperationSet({ ...operationSet, [operationName]: Boolean(checked) })
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
    </div>
  )
}
