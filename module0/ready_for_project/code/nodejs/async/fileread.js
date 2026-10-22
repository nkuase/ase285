const { readFile, readFileSync } = require('fs');

// Blocking! Nothing else runs until the file is read.
const txt = readFileSync('./hello.txt', 'utf8');
console.log(txt);

// Non-blocking: the callback runs later, when the file has been read.
readFile('./hello.txt', 'utf8', (err, txt) => {
  if (err) return console.error(err.message);
  console.log(txt);
});

// Run it from this directory: node fileread.js
