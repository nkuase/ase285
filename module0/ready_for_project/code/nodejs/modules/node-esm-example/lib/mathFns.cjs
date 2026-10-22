// A CommonJS module (.cjs), used from an ES module in index3.js
function sub(a, b) {
  return Number(a) - Number(b);
}

function div(a, b) {
  if (Number(b) === 0) throw new Error("Division by zero");
  return Number(a) / Number(b);
}

module.exports = { sub, div };
