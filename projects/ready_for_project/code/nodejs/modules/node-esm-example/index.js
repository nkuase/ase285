// index.js — Using ES Modules

import sub, { add, multiply, div, Calculator } from './math.js';

const a = 12;
const b = 3;

console.log('Using ES Module Functions:');
console.log(`add(${a}, ${b}) =`, add(a, b));
console.log(`multiply(${a}, ${b}) =`, multiply(a, b));
console.log(`sub(${a}, ${b}) =`, sub(a, b)); // default import
console.log(`div(${a}, ${b}) =`, div(a, b));

console.log('\nUsing ES Module Class:');
const calc = new Calculator();
console.log(`add(${a}, ${b}) =`, calc.add(a, b));
console.log(`multiply(${a}, ${b}) =`, calc.multiply(a, b));

// CLI mode: node index.js 20 5
if (process.argv.length >= 4) {
  const x = Number(process.argv[2]);
  const y = Number(process.argv[3]);
  console.log('\nCLI mode:');
  console.log(`add(${x}, ${y}) =`, add(x, y));
  console.log(`multiply(${x}, ${y}) =`, multiply(x, y));
  console.log(`sub(${x}, ${y}) =`, sub(x, y));
  try {
    console.log(`div(${x}, ${y}) =`, div(x, y));
  } catch (err) {
    console.error('div error:', err.message);
  }
}
