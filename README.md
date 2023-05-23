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

## About

I don't know about you, but getting the integer factorization of a number is a need that I encounter pretty frequently. This is why I made this factorization tool and put it on my website.

This tool uses JS's native BigInt-s to factorise numbers. The approach isn't sophisticated in any way, we just look for divisors of the target integer, starting with 2, then 3 and then alternatively adding 2 and 4, up until we reach the square root of the target integer.

With this approach, the cases which take the longest time are prime numbers, since we need to check for divisors all the way up to their square root. For prime integers long of 18 digits, the computation takes more than 10 seconds on my machine. To avoid freezing the page longer than this, this tool refuses to work with integers longer than 18 decimal digits.
