// run "npm install . "

const {URI} = require('./_config.js');
const util = require('../util/mongodbutil.js')

const DATABASE = 'todoapp'; 
const POSTS = 'posts';
const COUNTER = 'counter';

// Install express
const express = require('express');
const app = express();

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
      await util.update(URI, DATABASE, COUNTER, query, {$set: {totalPost: totalPost + 1}});
      resp.send('Stored to Mongodb OK'); // This is ugly, so change it to redirect
    } catch (e) {
      console.error(e);
    }
}

app.get('/list', function(req, resp){
  runListGet(req, resp);
});

async function runListGet(req, resp) {
    try {
      let res = await util.read(URI, DATABASE, POSTS, {}) // {} query returns all documents
      if (res.length == 0) {
        resp.redirect('/');
      } else {
        const query = { posts: res };
        resp.render('list.ejs', query)
      }        
    } catch (e) {
      console.error(e);
    } 
}
