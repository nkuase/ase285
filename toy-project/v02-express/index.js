// run "npm install . "

const MongoClient = require('mongodb').MongoClient;

const uri = require('./db.js');
var db;

const DATABASE = 'todoapp'; 
const COLLECTION = 'posts'

MongoClient.connect(uri, { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db(DATABASE);
});

// Install express
const express = require('express');
const app = express();
const bodyParser= require('body-parser')

app.use(bodyParser.urlencoded({extended: true})) 
app.use(express.urlencoded({extended: true})) 

// callback functions

app.listen(5500, function() {
    console.log('listening on 5500')
});

app.get('/', function(req, resp) { 
    resp.sendFile(__dirname +'/write.html')
});

app.post('/add', async function(req, resp) {
    console.log(req.body);
    resp.send('Sent');
    try {
      // Connect the client to the server (optional starting in v4.7)
      const posts = db.collection(`${COLLECTION}`);
  
      const query = { title : req.body.title, date : req.body.date }
      await posts.insertOne(query);
    } catch (e) {
      console.error(e);
    } 
});
