const {URI} = require('./_config.js');
const util = require('../util/mongodbutil.js')

const DATABASE = 'todoapp'; 
const COLLECTION = 'posts'; 

util.run(URI, DATABASE, {ping: 1}, 'Run Ping OK'); // Don't forget the ';' when we use (async() ...) function.
(async () => {
  await util.create(URI, DATABASE, COLLECTION, {name: 'John', age: 25}, 'Create OK'); 
  let res = util.read(URI, DATABASE, COLLECTION, {}, 'Read OK');
  console.log(res); 
  await util.update(URI, DATABASE, COLLECTION, {name: 'John'}, {$set: {age: 26}}, 'Update OK');
  res = util.read(URI, DATABASE, COLLECTION, {}, 'Read OK');
  console.log(res); 
  await util.delete_document(URI, DATABASE, COLLECTION, {name: 'John'}, 'Delete OK'); 
  res = util.read(URI, DATABASE, COLLECTION, {}, 'Read OK');
  console.log(res);   
})();