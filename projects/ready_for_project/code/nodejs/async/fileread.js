const { readFile, readFileSync } = require('fs');

// Blocking!
const txt = readFileSync('./hello.txt', 'utf8');
console.log(txt)


// Non-blocking
readFile('./hello.txt', 'utf8', (err, txt) => {
    console.log(txt)
});

