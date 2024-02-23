const fs = require('fs');

// Example binary data (array of bytes)
const binaryData = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64]);

// Writing binary data to a file
try {
  fs.writeFileSync('example.bin', binaryData)
  console.log('File written successfully');
}
catch (err) {
  console.error('Error writing file:', err);
}
// Reading binary data from a file
try {
  const data = fs.readFileSync('example.bin')
  console.log('File data:', data);
  console.log('String data:', data.toString());  
} 
catch (err) {
  console.error('Error reading file:', err);
}

// Writing binary data to a file
try {
  fs.writeFileSync('example.txt', 'Hello World')
  console.log('File written successfully');
}
catch (err) {
  console.error('Error writing file:', err);
}
// Reading binary data from a file
try {
  const data = fs.readFileSync('example.txt')
  console.log('File data:', data);
  console.log('String data:', data.toString());  
} 
catch (err) {
  console.error('Error reading file:', err);
}
