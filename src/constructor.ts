import { MathList, Operation, SolutionObject } from "./type"
import { addSolution, baseDecomposition, factorization } from "./util"

export function createConstructor(
  operationSet: Record<Operation, boolean>,
  baseArray: number[],
  target: number,
  option: { baseDecompositionOnly: boolean } = { baseDecompositionOnly: false },
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
              addSolution(solutionObject, [...mathList, p, "subtract"])
            })
          }
        }
      })

      if (option.baseDecompositionOnly) {
        return solutionObject[target]
      }

      const solver = (target: number, baseArray: number[]) => {
        return createConstructor(operationSet, baseArray, target, {
          baseDecompositionOnly: true,
        }).obtain()[0].math
      }
      const addFactorisationSolutionSet = (target: number, extra: MathList) => {
        if (target >= 1) {
          factorization(target, baseArray, solver).forEach((mathList) =>
            addSolution(solutionObject, [...mathList, ...extra]),
          )
        }
      }
      addFactorisationSolutionSet(target, [])
      baseArray.forEach((p) => {
        addFactorisationSolutionSet(target + p, [p, "subtract"])
        addFactorisationSolutionSet(target - p, [p, "add"])
      })

      return solutionObject[target]
    },
  }
}
