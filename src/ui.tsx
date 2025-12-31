import { ReactNode, useMemo, useState } from "react"
import { Checkbox } from "./checkbox"
import { createConstructor } from "./constructor"
import { Input } from "./input"
import { Operation, Solution } from "./type"
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
  let [atMostOnce, setAtMostOnce] = useState(false)
  let [atLeastOnce, setAtLeastOnce] = useState(false)

  let baseList = baseString
    .split(/\s+/)
    .filter((x) => x)
    .map((x) => Number(x) || 2)

  let [solutionArray, obtentionError] = useMemo(() => {
    let solutionArray: Solution[] = []
    let obtentionError
    try {
      solutionArray = createConstructor(operationSet, baseList, Number(target) || 0).obtain() || []
    } catch (e) {
      console.error(e)
      obtentionError = e
    }
    return [solutionArray, obtentionError]
  }, [operationSet, baseString, target])

  if (atMostOnce) {
    solutionArray = solutionArray.filter((solution) => {
      let counter: Record<number, number> = {}
      solution.math.forEach((v) => {
        if (typeof v === "number") {
          counter[v] = (counter[v] ?? 0) + 1
        }
      })
      return Object.values(counter).every((count) => count <= 1)
    })
  }

  if (atLeastOnce) {
    solutionArray = solutionArray.filter((solution) => {
      let counter: Record<number, number> = {}
      baseList.forEach((base) => {
        counter[base] = 0
      })
      solution.math.forEach((v) => {
        if (typeof v === "number") {
          counter[v] = (counter[v] ?? 0) + 1
        }
      })
      return Object.values(counter).every((count) => count >= 1)
    })
  }

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
      <label>
        <Checkbox
          name={`atMostOnce`}
          setValue={(checked) => {
            setAtMostOnce(checked)
          }}
        />
        At most once
      </label>
      <label>
        <Checkbox
          name={`atLeastOnce`}
          setValue={(checked) => {
            setAtLeastOnce(checked)
          }}
        />
        At least once
      </label>
      <Input name="base" setValue={setBaseString} />
      <Input
        name="target"
        setValue={(value) => {
          if (!Number.isNaN(Number(value))) {
            setTarget(value)
          }
        }}
      />
      {obtentionError && <pre>{obtentionError.message}</pre>}
      {solutionArray.length} solution(s)
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
