export function isPrime(num: bigint) {
    // Non integer or any number less than 2 is not prime
    if (num < 2n) return false
    // Even number: only prime if it is 2
    if (num % 2n === 0n) return num === 2n
    // Odd number divisible by 3: only prime if it is 3
    if (num % 3n === 0n) return num === 3n
    // Search for factor 5, 7, 11, 13, 17, 19, 23, 25, 29, 31, 35, 37...
    // up to and including square root of input number
    const floorSqrt = BigInt(Math.sqrt(Number(num)) + 1)
    for (let i = 5n; i <= floorSqrt; i += 6n) {
        if (num % i === 0n || num % (i + 2n) === 0n) return false
    }
    return true
}

function calculate(inputNum: bigint, result: bigint[] = [], repeat = true): bigint[] {
    // absolute value
    const num = inputNum >= 0n ? inputNum : -inputNum

    if (num < 2n) return result
    const squareRoot = BigInt(Math.ceil(Math.sqrt(Number(num))))
    let x = 2n
    if (num % x) {
        x = 3n
        if (num % x) {
            x = 5n
            let add = 2n
            while (num % x && x <= squareRoot) {
                // search numbers: 5, 7, 11, 13, 17, 19, 23...
                x += add
                // add each time: 2, 4, 2, 4, 2, 4, 2...
                add = 6n - add
            }
        }
    }

    x = x <= squareRoot ? x : num

    if (!repeat) {
        const index = result.indexOf(x)
        if (index < 0) result.push(x)
    } else result.push(x)

    return x === num ? result : calculate(num / x, result, repeat)
}

export function getFactors(num: bigint) {
    return calculate(num, [], true)
}

export function getUniqueFactors(num) {
    return calculate(num, [], false)
}

export function getPrimeExponentObject(num: bigint, factors?: bigint[]) {
    if (!factors) {
        factors = calculate(num)
    }
    const countObject: Record<string, number> = {}
    for (const factor of factors) {
        let f = "" + factor
        countObject[f] = (countObject[f] ?? 0) + 1
    }
    return countObject
}
