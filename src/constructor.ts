import { Operation, SolutionObject } from "./type"
import { addSolution, baseDecomposition, factorization } from "./util"

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
        if (n > 1 && operationSet.add && operationSet.multiply) {
          addSolution(solutionObject, baseDecomposition(target, n, { 10: [5, 5, "add"] }))
          if (operationSet.subtract) {
            baseArray.forEach((p) => {
              const mathList = baseDecomposition(target + p, n, { 10: [5, 5, "add"] })
              if (mathList.length === 0) {
                throw new Error(`empty mathList for target ${target}, offset ${p}, base ${n}`)
              }
              addSolution(solutionObject, [...mathList, p, "subtract"])
            })
          }
        }
      })

      if (target >= 1) {
        const solver = (target: number, baseArray: number[]) => {
          return createConstructor(operationSet, baseArray, target).obtain()[0].math
        }
        factorization(target, baseArray, solver).forEach((solution) =>
          addSolution(solutionObject, solution),
        )
      }

      return solutionObject[target]
    },
  }
}
