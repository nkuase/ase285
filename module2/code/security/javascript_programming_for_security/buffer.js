const { x } = require('./module'); // x is a Buffer object

console.log('Original Buffer:', x);
console.log('Buffer content (UTF-8):', x.toString('utf-8'));

// Convert to hexadecimal string (for series of numbers)
var hexString = x.toString('hex');
console.log('Hexadecimal representation:', hexString);

// Convert to UTF-8 string
var utf8String = x.toString('utf-8');
console.log('UTF-8 string:', utf8String);

// Convert back to buffer object
var z = Buffer.from(utf8String, 'utf-8');
console.log('New Buffer from string:', z);
console.log('Are buffers equal?', x.equals(z));
