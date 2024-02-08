// npm install -g nodemon
// inpm install . 
// npm start
const {URI} = require('./_config.js');
const util = require('../crud/mongodbutil.js')

const DATABASE = 'todoapp'; 
const COLLECTION = 'posts'; // Don't forget the ';' 

util.run(URI, DATABASE, {ping: 1}, 'Run Ping OK');
util.create(URI, DATABASE, COLLECTION, {name: 'John', age: 25}, 'Create OK'); 
