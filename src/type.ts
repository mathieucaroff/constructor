export type Operation = "add" | "multiply" | "subtract" | "divide" | "remainder" | "exponent"

export type MathList = (Operation | number)[]

export type Solution = {
  complexity: number
  math: MathList
}

export type SolutionObject = Record<number, Solution[]>
