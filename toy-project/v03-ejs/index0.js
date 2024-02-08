// run "npm install . "

const {URI} = require('./_config.js');
const util = require('../util/mongodbutil.js')

const DATABASE = 'todoapp'; 
const POSTS = 'posts';
const COUNTER = 'counter';

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
      let query = {name : 'Total Post'};
      let res = await util.read(URI, DATABASE, COUNTER, query)
      let totalPost = 0;
      if (res.length != 0) {
        totalPost = res[0].totalPost;
        console.log(res);
      } else {
        query = { name : 'Total Post', totalPost : 0};
        res = await util.create(URI, DATABASE, COUNTER, query);
      }

      query = { _id : totalPost + 1, title : req.body.title, date : req.body.date};
      res = await util.create(URI, DATABASE, POSTS, query);
      
      query = {name : 'Total Post'};
      let stage = {totalPost: totalPost + 1};
      await util.update(URI, DATABASE, COUNTER, query, stage);
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
      let res = await util.read(URI, DaTABASE, POSTS, {}) // {} query returns all documents
//      const posts = db.collection(POSTS);
//      const res = await posts.find().toArray();
      const query = { posts: res };
      resp.render('list.ejs', query)
    } catch (e) {
      console.error(e);
    } 
}
