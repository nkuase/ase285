// index2.js — Using ES Modules: import everything with "* as"

import sub, * as math from './math.js';

const a = 12;
const b = 3;

console.log('Using ES Module Functions:');
console.log(`add(${a}, ${b}) =`, math.add(a, b));
console.log(`sub(${a}, ${b}) =`, sub(a, b)); // the default export is imported separately
