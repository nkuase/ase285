# Node.js ES Module Example

This project demonstrates **ES Module syntax** (`import/export`) in Node.js.

## Files
- `math.js`: exports functions (`add`, `multiply`, `div`) and a default `sub`, plus a `Calculator` class.
- `index.js`: imports and uses them.
- `package.json`: includes `"type": "module"` to enable ESM.

## Run Example
```bash
node index.js
node index.js 20 5
npm start
```

## Explanation

- Default export → `sub(a, b)`  
- Named exports → `add`, `multiply`, `div`, and `Calculator`
- Import syntax:
  ```js
  import sub, { add, multiply, div, Calculator } from './math.js';
  ```
