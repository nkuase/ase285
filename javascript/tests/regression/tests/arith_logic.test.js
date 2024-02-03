const arith = require('../src/arith');
const logic = require('../src/logic');

// checks arith and logic module
function check1(x, y) {
  var r1 = arith.add(x, y);
  var r2 = arith.add(x, y*10)
  var r3 = logic.all_more_than_5(r1, r2);
  return r3;
}

test('integration test 1', () => {
  expect(check1(5, 1)).toBe(true);
});