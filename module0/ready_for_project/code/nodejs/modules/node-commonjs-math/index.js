// Demo consumer using require(...)
const Calculator = require('./lib/Calculator');
const { sub, div } = require('./lib/mathFns');

const calc = new Calculator();

const a = 12;
const b = 3;

console.log('Using Calculator class:');
console.log(`add(${a}, ${b}) =`, calc.add(a, b));
console.log(`multiply(${a}, ${b}) =`, calc.multiply(a, b));

console.log('\nUsing function module:');
console.log(`sub(${a}, ${b}) =`, sub(a, b));
console.log(`div(${a}, ${b}) =`, div(a, b));

// Quick CLI usage: node index.js 20 5
if (process.argv.length >= 4) {
  const x = Number(process.argv[2]);
  const y = Number(process.argv[3]);
  console.log('\nCLI mode:');
  console.log(`add(${x}, ${y}) =`, calc.add(x, y));
  console.log(`multiply(${x}, ${y}) =`, calc.multiply(x, y));
  console.log(`sub(${x}, ${y}) =`, sub(x, y));
  try {
    console.log(`div(${x}, ${y}) =`, div(x, y));
  } catch (err) {
    console.error('div error:', err.message);
  }
}
