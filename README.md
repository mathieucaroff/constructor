# Factorization

Your basic factorization program, with 3 display format:

- Repeating primes as many times as they appear
- Using the double-star power (`**`) to represent exponents
- Using formatting to represent the exponents

For example, `8943411348` gives the following three outputs:

- 2 * 2 * 3 * 3 * 4099 * 60607
- 2\**2 * 3**2 * 4099 * 60607
- 2<sup>2</sup> 3<sup>2</sup> 4099 60607 

This tool uses JS's BigInts to factorise numbers. It refuses to work with numbers longer than 18 digits because they take too long. Beware, some 18-digits primes like `981168724994134051` still take over 10 seconds to verify as prime.
