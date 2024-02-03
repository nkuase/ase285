const logic = require('../src/logic');

test('True when both inputs are more than 5', () => {
  expect(logic.all_more_than_5(11, 12)).toBe(true);
});