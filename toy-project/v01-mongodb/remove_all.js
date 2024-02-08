const {URI} = require('./_config.js');
const util = require('../util/mongodbutil.js')

const DATABASE = 'todoapp'; 
const POSTS = 'posts'; 
const COUNTER = 'counter'; 

// Call the function to remove all documents
util.removeAllDocuments(URI, DATABASE, POSTS);
util.removeAllDocuments(URI, DATABASE, COUNTER);