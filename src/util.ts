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
    complexity += Math.ceil(count / 4)
  })

  return complexity
}

export function resolveMath(math: MathList): number {
  let stack: number[] = []
  math.forEach((piece) => {
    if (typeof piece === "number") {
      stack.push(piece)
    } else {
      const f = {
        add: (a: number, b: number) => a + b,
        multiply: (a: number, b: number) => a * b,
        subtract: (a: number, b: number) => a - b,
        divide: (a: number, b: number) => Math.floor(a / b),
        remainder: (a: number, b: number) => a % b,
        exponent: (a: number, b: number) => a ** b,
      }[piece]
      if (f === undefined) {
        throw new Error(`unrecognized operator "${piece}"`)
      }
      const b = stack.pop()!
      const a = stack.pop()!
      if (a === undefined) {
        throw new Error("math formula containing not enough numbers for operators")
      }
      stack.push(f(a, b))
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

  const replace = (value: number) => overrideRecord[value] ?? [value]
  let multiplicationByBase: MathList = [...replace(base), "multiply"]

  let [first, ...list] = decomposition
  let parsedFirst = parseInt(first, base)
  math.push(...replace(parsedFirst), ...multiplicationByBase)
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

export function factorization(
  target: number,
  baseArray: number[],
  solver: (target: number, baseArray: number[]) => MathList,
): MathList[] {
  if (target < 1) {
    return []
  }

  let mathList: MathList = []

  let decomposition = factorizationDecomposition(target)
  if (decomposition.length < 2) {
    // The given number is prime and cannot be factorized further
    return []
  }

  decomposition.forEach((piece, k) => {
    if (baseArray.includes(piece)) {
      mathList.push(piece)
    } else {
      mathList.push(...solver(piece, baseArray))
    }
    if (k > 0) {
      mathList.push("multiply")
    }
  })

  return [mathList]
}

export function factorizationDecomposition(target: number): number[] {
  if (target < 1) {
    throw new Error("expected target to be at least 1")
  } else if (target === 1) {
    return [1]
  }
  let decomposition: number[] = []
  let remaningTarget = target

  while (remaningTarget > 1 && remaningTarget % 2 === 0) {
    remaningTarget /= 2
    decomposition.push(2)
  }

  while (remaningTarget > 1 && remaningTarget % 3 === 0) {
    remaningTarget /= 3
    decomposition.push(3)
  }

  let factor = 5
  let step = 2
  while (remaningTarget > 1) {
    if (remaningTarget % factor === 0) {
      remaningTarget /= factor
      decomposition.push(factor)
    } else {
      factor += step
      step ^= 6
    }
  }

  return decomposition
}
