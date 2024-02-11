// npm install -g nodemon

// npm install .
// nodemon ./index.js
// Access this server with http://localhost:5500

const { TodoApp } = require('../util/utility.js');

const dotenv = require("dotenv");
dotenv.config();
const URI = process.env.URI
console.log(URI)

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';
const postapp = new TodoApp(URI, DATABASE, POSTS, COUNTER);

const express = require('express');
const app = express();
const methodOverride = require('method-override')



app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/stylesheets', express.static('stylesheets'));
app.use(methodOverride('_method'))

app.listen(5500, function () {
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

app.get('/detail/:id', async function (req, resp) {
  try {
    await postapp.runDetailIdGet(req, resp); 
  } catch (e) {
    console.error(e);
  }    
});

app.get('/edit/:id', async function (req, resp) {
  try {
    await postapp.runEditIdGet(req, resp); 
  } catch (e) {
    console.error(e);
  }    
});

app.put('/edit', async function (req, resp) {
  try {
    await postapp.runEditPut(req, resp); 
  } catch (e) {
    console.error(e);
  }     
}); 
