// run "npm install . "

const {URI} = require('./_config.js');
const { TodoApp } = require('../util/utility.js');

const DATABASE = 'todoapp'; 
const POSTS = 'posts';
const COUNTER = 'counter';

const postapp = new TodoApp(URI, DATABASE, POSTS, COUNTER);
console.log(postapp);

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
  postapp.runAddPost(req, resp);
});

app.get('/list', function(req, resp){
  postapp.runListGet(req, resp);
});

