const { info } = require('console');
const fs = require('fs');

const array = [10,20,30];
const filename = 'jsonfile2.json';
const infoToShare = {name: 'John', value: array}; // Buffered data
console.log(infoToShare); // JSON object
try {
  const jsonstring =  JSON.stringify(infoToShare);
  fs.writeFileSync(filename, jsonstring) //
} catch (err) {
  console.log(err)
}

try {
  let data = fs.readFileSync(filename, 'utf8')
  console.log(data); // String data
  let jsondata = JSON.parse(data); // JSON object
  console.log(jsondata);
} catch (err) {
  console.log(err)
}
    