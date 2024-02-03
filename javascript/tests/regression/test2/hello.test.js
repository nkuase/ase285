const {hello} = require('../src/hello.js');

test('print out hello', () => {
    expect(hello()).toBe('Hello');
});
