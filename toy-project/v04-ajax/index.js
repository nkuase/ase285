const {URI} = require('./_config.js');
const { TodoApp } = require('../util/utility.js');

const DATABASE = 'todoapp'; 
const POSTS = 'posts';
const COUNTER = 'counter';

const postapp = new TodoApp(URI, DATABASE, POSTS, COUNTER);

// Install express
const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true})) 
app.set('view engine', 'ejs');

app.listen(5500, function() {
    console.log('listening on 5500')
});

app.get('/', async function(req, resp) { 
  try {
    await resp.render('write.ejs')
  } catch (e) {
    console.error(e);
  } 
});

app.post('/add', async function(req, resp) {
  try {
    await postapp.runAddPost(req, resp);
  } catch (e) {
    console.error(e);
  } 
});

app.get('/list', async function(req, resp){
  try {
    await postapp.runListGet(req, resp);
  } catch (e) {
    console.error(e);
  }   
});

app.delete('/delete', async function(req, resp){   
  try {
    await postapp.runDeleteDelete(req, resp); 
  } catch (e) {
    console.error(e);
  }     
}); 