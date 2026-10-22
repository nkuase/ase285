// index3.js — Using a CommonJS module from an ES module

// The default import is the whole `module.exports` object.
import mathFns from './lib/mathFns.cjs';

const a = 12;
const b = 3;

console.log('Using a CommonJS module:');
console.log(`sub(${a}, ${b}) =`, mathFns.sub(a, b));
console.log(`div(${a}, ${b}) =`, mathFns.div(a, b));
