const fs = require('fs');
const { x } = require('./module'); // x is a Buffer with "Hello World"

console.log('=== Original Buffer ===');
console.log('Buffer:', x); // Buffer: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log('String:', x.toString('utf-8')); // String: Hello World
console.log('Bytes:', Array.from(x)); // Bytes: [72, 101, 108, 108, 111,  32,  87, 111, 114, 108, 100] Store Buffer as hex string

const hexString = x.toString('hex');
console.log('\n=== Saving to file ===');
console.log('Hex string to save:', hexString); // Hex string to save: 48656c6c6f20576f726c64
console.log('Type:', typeof hexString); // Type: string
console.log('Length:', hexString.length, 'characters'); // Length: 22 characters (2 x 11)

try {
    fs.writeFileSync('files.txt', hexString); // 48656c6c6f20576f726c64
    console.log('✓ Saved to files.txt');
} catch (err) {
    console.log(err);
}

// Read and convert back
try {
    console.log('\n=== Reading from file ===');
    var content = fs.readFileSync('files.txt');
    
    console.log('Read content (Buffer):', content); // Read content (Buffer): <Buffer 34 38 36 35 36 63 36 63 36 66 32 30 35 37 36 66 37 32 36 63 36 34>
    console.log('Read content (String):', content.toString()); // Read content (String): 48656c6c6f20576f726c64
    console.log('Buffer bytes:', Array.from(content).slice(0, 10), '...'); // Buffer bytes: [ 52, 56, 54, 53,  54, 99, 54, 99, 54, 102 ]
    
    // Convert hex string back to original Buffer
    var c = Buffer.from(content.toString(), "hex"); 
    
    console.log('\n=== Converted back ===');
    console.log('Reconstructed Buffer:', c); // Reconstructed Buffer: <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
    console.log('Reconstructed String:', c.toString("UTF-8")); // Reconstructed String: Hello World
    console.log('Bytes match original?', x.equals(c)); // Bytes match original? true
    
} catch (err) {
    console.log(err);
}

