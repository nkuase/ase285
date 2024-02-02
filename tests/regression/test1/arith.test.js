const {add, sub} = require('../src/arith.js');

test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
});
test('adds 1 + 2 to equal 3', () => {
    expect(sub(1, 2)).toBe(-1);
});  