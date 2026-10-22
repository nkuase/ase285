# Node.js ES Module Example

This project demonstrates **ES Module syntax** (`import/export`) in Node.js.

## Files
- `math.js`: exports functions (`add`, `multiply`, `div`) and a default `sub`, plus a `Calculator` class.
- `index.js`: imports and uses them.
- `index2.js`: imports everything with `import sub, * as math`.
- `index3.js`: uses a CommonJS module (`lib/mathFns.cjs`) from an ES module.
- `package.json`: includes `"type": "module"` to enable ESM.

## Run Example
```bash
node index.js
node index.js 20 5
node index2.js
node index3.js
npm start
```

## Explanation

- Default export → `sub(a, b)`  
- Named exports → `add`, `multiply`, `div`, and `Calculator`
- Import syntax:
  ```js
  import sub, { add, multiply, div, Calculator } from './math.js';
  ```
