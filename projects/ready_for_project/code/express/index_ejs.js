const { getDB } = require('./util/db');

const DATABASE = 'todoapp';
const POSTS = 'posts'
const COUNTER = 'counter'

async function initialize() {
  db = await getDB(DATABASE);
}

initialize();

// Install express
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// callback functions
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

    const result = await counter.findOneAndUpdate(
      { name: 'count' },
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    //console.log(result);

    const newId = result.count; // now safe to access

    const newPost = {
      _id: newId,
      title: req.body.title,
      date: req.body.date
    };

    await posts.insertOne(newPost);

    resp.send('Stored to MongoDB OK');

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

 