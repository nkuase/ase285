const {URI} = require('./_config.js');
const util = require('./mongodbutil0.js')

const DATABASE = 'todoapp'; 
const POSTS = 'posts'; 
const COUNTER = 'counter'; 

// Call the function to remove all documents
(async () => {
  let res = util.readJSON('ase_courses.json');
  console.log(res);
  await util.uploadJSON(URI, DATABASE, COUNTER, 'ase_courses.json');
})();