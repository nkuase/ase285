const fs = require('fs');

function compareTwoInfo(info1, info2) {
    let isEqual = true;
    
    if (info1.length === info2.length) {
        for (let i = 0; i < info1.length; i++) {
            if (info1[i] !== info2[i]) {
                isEqual = false;
                break;
            }
        }
    } else {
        isEqual = false;
    }
    
    return isEqual
}

// Example binary data (array of bytes)
const binaryData = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64]);
const stringData = 'Hello World';
console.log(Buffer.from(stringData)); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(binaryData); // Uint8Array(11) [ 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100 ]
console.log(Buffer.from(binaryData)) // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>

console.log(compareTwoInfo(stringData, binaryData)) // false as they are different
console.log(compareTwoInfo(Buffer.from(stringData), Buffer.from(binaryData))) // true
console.log(compareTwoInfo(Buffer.from(stringData), binaryData)) // true 

// binaryData is Uint8Array object 
console.log(binaryData.toString()); // 72,101,108,108,111,32,87,111,114,108,100
console.log(binaryData.toString('hex')) // 72,101,108,108,111,32,87,111,114,108,100
console.log(binaryData.toString('utf8')) // 72,101,108,108,111,32,87,111,114,108,100
console.log(binaryData.toString('base64')) // 72,101,108,108,111,32,87,111,114,108,100

// b is buffered object
const b = Buffer.from(stringData)
console.log(b); // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(b.toString()); // Hello World
console.log(b.toString('hex')) // 48656c6c6f20576f726c64
console.log(b.toString('utf8')) // Hello World
// ransforms binary data into a sequence of printable characters, limited to a set of 64 unique characters
console.log(b.toString('base64')) // SGVsbG8gV29ybGQ=

var base64 = b.toString('base64') // base64 encoded renderToString
// Buffer.from converts a string of any encoding into a buffer 
var value = Buffer.from(base64, 'base64')
console.log(value) // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(value.toString()) // Hello World
