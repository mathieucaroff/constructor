import { default as assert } from "assert"
import { baseDecomposition, resolveMath } from "./util"

describe("decomposition and math resolution", () => {
  it("resolves to the initial number", () => {
    for (let target = 0; target < 20; target += 1) {
      for (let base = 2; base < 17; base += 1) {
        let decomposition = baseDecomposition(target, base, { 10: [5, 5, "add"] })
        let result = resolveMath(decomposition)
        let decompositionString = JSON.stringify(decomposition)
        let message = `target=${target} base=${base} decomposition=${decompositionString} result=${result}`
        assert.strictEqual(result, target, message)
      }
    }
  })
})
