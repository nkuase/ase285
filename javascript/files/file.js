const fs = require('fs');

// Example binary data (array of bytes)
const binaryData = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64]);

// Writing binary data to a file
fs.writeFile('example.bin', binaryData, (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});

// Reading binary data from a file
fs.readFile('example.bin', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File data:', data);
  console.log('String data:', data.toString());
});

// Writing text data to a file
fs.writeFile('example.txt', 'Hello World', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});
  
// Reading binary data from a file
fs.readFile('example.txt', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File data:', data);
  console.log('String data:', data.toString());
});