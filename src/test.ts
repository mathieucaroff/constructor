import { default as assert } from "assert"
import { baseDecomposition, resolveMath } from "./util"

describe("decomposition and math resolution", () => {
  it("resolves to the initial number", () => {
    for (let target = 0; target < 20; target += 1) {
      for (let base = 2; base < 17; base += 1) {
        let result = resolveMath(baseDecomposition(target, base, { 10: [5, 5, "add"] }))
        assert.strictEqual(result, target, `target=${target} base=${base}`)
      }
    }
  })
})
