# node-commonjs-math

This is a minimal Node.js (CommonJS) example that exports a class and functions using `module.exports`
and consumes them with `require(...)`.

## Files
- `lib/Calculator.js` — exports a `Calculator` class with `add(a,b)` and `multiply(a,b)`.
- `lib/mathFns.js` — exports `sub(a,b)` and `div(a,b)` functions.
- `index.js` — demo that requires both modules and prints results.

## Run
```bash
node index.js
# or
npm start
```
