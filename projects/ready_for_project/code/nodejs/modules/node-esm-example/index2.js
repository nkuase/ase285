// index.js — Using ES Modules

import sub, * as math from './math.js';

const a = 12;
const b = 3;

console.log('Using ES Module Functions:');
console.log(`add(${a}, ${b}) =`, math.add(a, b));

