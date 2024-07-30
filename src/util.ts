import { MathList, Operation, SolutionObject } from "./type"

export const operationEnumeration: Operation[] = [
  "add",
  "multiply",
  "subtract",
  "divide",
  "remainder",
  "exponent",
]

export function createSolution(math: MathList) {
  return {
    complexity: computeComplexity(math),
    math,
  }
}

export function getSolutionArray(solutionObject: SolutionObject, target: number) {
  return (solutionObject[target] = solutionObject[target] || [])
}

// The solution array is sorted from lowest complexity to highest.
export function addSolution(solutionObject: SolutionObject, ...mathArray: MathList[]) {
  mathArray.forEach((math) => {
    let target = resolveMath(math)
    let solutionArray = getSolutionArray(solutionObject, target)
    if (solutionArray.filter((solution) => solution.math === math).length > 0) {
      return
    }
    solutionArray.push(createSolution(math))
    solutionArray.sort((a, b) => a.complexity - b.complexity)
  })
}

export function computeComplexity(math: MathList): number {
  let complexity = 0
  let countRecord: Record<number, number> = {}
  math.forEach((piece) => {
    if (typeof piece === "number") {
      countRecord[piece] = (countRecord[piece] ?? 0) + 1
    } else {
      complexity += {
        add: 1,
        multiply: 1.25,
        subtract: 1.5,
        divide: 1.75,
        remainder: 1.75,
        exponent: 2,
      }[piece]
    }
  })

  Object.values(countRecord).forEach((count) => {
    complexity += Math.ceil(count / 2)
  })

  return complexity
}

export function resolveMath(math: MathList): number {
  let stack: number[] = []
  math.forEach((piece) => {
    if (typeof piece === "number") {
      stack.push(piece)
    } else {
      stack.push(
        {
          add: (a: number, b: number) => a + b,
          multiply: (a: number, b: number) => a * b,
          subtract: (a: number, b: number) => a - b,
          divide: (a: number, b: number) => Math.floor(a / b),
          remainder: (a: number, b: number) => a % b,
          exponent: (a: number, b: number) => a ** b,
        }[piece](stack.pop()!, stack.pop()!),
      )
    }
  })
  if (stack.length > 1) {
    throw new Error("math formula containing too many numbers")
  }
  if (Number.isNaN(stack[0])) {
    throw new Error(
      `math resolution lead to NaN; this could be due to an unbalanced formula: math=${math}`,
    )
  }
  return stack[0]
}

export function baseDecomposition(
  target: number,
  base: number,
  overrideRecord: Record<number, MathList>,
): MathList {
  let math: MathList = []
  let decomposition = target.toString(base).split("")

  const replace = (value) => overrideRecord[value] ?? [value]
  let multiplicationByBase: MathList = [...replace(base), "multiply"]

  let [first, ...list] = decomposition
  let parsedFirst = parseInt(first, base)
  if (parsedFirst > 1) {
    math.push(...replace(parsedFirst), ...multiplicationByBase)
  } else {
    math.push(...replace(base))
  }
  list.forEach((digit: string) => {
    let parsedDigit = parseInt(digit, base)
    if (parsedDigit > 0) {
      math.push(...replace(parsedDigit), "add", ...multiplicationByBase)
    } else {
      math.push(...multiplicationByBase)
    }
  })
  let size = multiplicationByBase.length
  math.splice(-size, size) // remove the final multiplication by the base

  return math
}
