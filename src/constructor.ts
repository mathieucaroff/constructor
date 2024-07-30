import { addSolution, baseDecomposition } from "./util"
import { Operation, SolutionObject } from "./type"

export function createConstructor(
  operationSet: Record<Operation, boolean>,
  baseArray: number[],
  target: number,
) {
  return {
    obtain() {
      const solutionObject: SolutionObject = {}
      baseArray.forEach((n) => {
        if (n <= 0) {
          throw new Error(`Found negative number among bases: ${n}`)
        }
        addSolution(solutionObject, [n])
        ;(["add", "multiply", "exponent"] as Operation[]).forEach((operationName) => {
          if (operationSet[operationName]) {
            addSolution(solutionObject, [n, n, operationName])
          }
        })
        if (n > 1) {
          addSolution(solutionObject, baseDecomposition(target, n, { 10: [5, 5, "add"] }))
        }
      })

      return solutionObject[target]
    },
  }
}
