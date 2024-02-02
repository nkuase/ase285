// module2.js
// We must append js to the file name when importing a module.
import * as arith from './arithmetic2.js';

const sumResult = arith.add(3, 7);
console.log('Sum:', sumResult);

const subtractResult = arith.sub(10, 4);
console.log('Subtraction:', subtractResult);
