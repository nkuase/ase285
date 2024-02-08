// run "npm install . "
// reset counter/totalPost to 0
// remove all the documents in the posts

const {MongoClient} = require('mongodb');

const uri = require('./db.js');
var db;

const DATABASE = 'todoapp'; 
const POSTS = 'posts';
const COUNTER = 'counter';

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
app.set('view engine', 'ejs');

app.listen(5500, function() {
    console.log('listening on 5500')
});

app.get('/', function(req, resp) { 
  try {
    resp.render('write.ejs')
  } catch (e) {
    console.error(e);
  } 
});

app.post('/add', function(req, resp) {
    runAddPost(req, resp);
});

async function runAddPost(req, resp) {
    try {
      const counter = db.collection(COUNTER);
      const posts = db.collection(POSTS);      
  
      let query = {name : 'Total Post'};
      let res = await counter.findOne(query);
      console.log(res);
      const totalPost = res.totalPost;

      query = { _id : totalPost + 1, title : req.body.title, date : req.body.date};
      res = await posts.insertOne(query);
      
      query = {name : 'Total Post'};
      let stage = { $inc: {totalPost:1} };
      await counter.updateOne(query, stage);
      resp.send('Stored to Mongodb OK');
    } catch (e) {
      console.error(e);
    }
}


app.get('/list', function(req, resp){
  runListGet(req, resp);
});

async function runListGet(req, resp) {
    try {
      const posts = db.collection(POSTS);
      const res = await posts.find().toArray();
      const query = { posts: res };
      resp.render('list.ejs', query)
    } catch (e) {
      console.error(e);
    } 
}

app.delete('/delete', async function(req, resp){
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    try {
        const counter = db.collection(COUNTER);
        const posts = db.collection(POSTS)
        const res = await posts.deleteOne(req.body); 

        const query = {name : 'Total Post'};
        const stage = { $inc: {totalPost:-1} };
        await counter.updateOne(query, stage);

        console.log('Delete complete')
        resp.send('Delete complete')
    }
    catch (e) {
        console.error(e);
    } 
}); 