// module2.js
// We must append js to the file name when importing a module.
import { add, sub } from './arithmetic2.js';

const sumResult = add(3, 7);
console.log('Sum:', sumResult);

const subtractResult = sub(10, 4);
console.log('Subtraction:', subtractResult);
