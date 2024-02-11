// run "npm install . "

const {URI} = require('./_config.js');
const util = require('../util/mongodbutil.js')

const DATABASE = 'todoapp'; 
const COLLECTION = 'posts'

// Install express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 

// callback functions
app.listen(5500, function() {
    console.log('listening on 5500')
});

app.get('/', function(req, resp) { 
    resp.sendFile(__dirname +'/write.html')
});

app.get('/test', async function(req, resp) {
    console.log(req.body);
    resp.sendFile(__dirname +'/json/test.json')
}); 

app.get('/test2/:id', async function(req, resp) {
    let id = req.params.id;
    console.log(id);
    resp.send(`${id}`);
}); 

app.post('/add', async function(req, resp) {
    console.log(req.body);
    resp.send('Sent');
    const query = { title : req.body.title, date : req.body.date }
    util.create(URI, DATABASE, COLLECTION, query);
}); 
