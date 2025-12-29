// CommonJS named function exports (module.exports = { sub, div })
function sub(a, b) {
  return Number(a) - Number(b);
}

function div(a, b) {
  if (Number(b) === 0) {
    throw new Error("Division by zero");
  }
  return Number(a) / Number(b);
}

module.exports = { sub, div };
