// math.js — ES Module Example

// Default export
export default function sub(a, b) {
  return Number(a) - Number(b);
}

// Named exports
export function add(a, b) {
  return Number(a) + Number(b);
}

export function multiply(a, b) {
  return Number(a) * Number(b);
}

export function div(a, b) {
  if (Number(b) === 0) throw new Error("Division by zero");
  return Number(a) / Number(b);
}

// Class export example
export class Calculator {
  add(a, b) {
    return Number(a) + Number(b);
  }
  multiply(a, b) {
    return Number(a) * Number(b);
  }
}
