// CommonJS class export (module.exports = Calculator)
// Provides add and multiply methods.
class Calculator {
  add(a, b) {
    return Number(a) + Number(b);
  }
  multiply(a, b) {
    return Number(a) * Number(b);
  }
}

module.exports = Calculator;
