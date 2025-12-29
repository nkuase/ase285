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

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

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

    // 1. Increase counter and get the NEW value in one atomic step
    const result = await counter.findOneAndUpdate(
      { name: 'count' },
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    const newId = result.count; // now safe to access

    // 2. Insert new post using the incremented ID
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

app.delete('/delete', async function(req, resp){
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    try {
        const posts = db.collection(POSTS)
        const res = await posts.deleteOne(req.body); 

        console.log('Delete complete')
        resp.send('Delete complete')
    }
    catch (e) {
        console.error(e);
    } 
}); 

app.get('/edit/:id', async function (req, resp) {
  console.log(req.params)
  try {
    const posts = db.collection(POSTS)      
    let res = await posts.findOne({ _id: parseInt(req.params.id) })
    console.log({ data: res })
    if (res != null) {
      resp.render('edit.ejs', { data: res })
    }
    else {
      resp.status(500).send({ error: 'result is null' })
    }
  }
  catch (error) {
    console.log(error)
    resp.status(500).send({ error: 'Error from db.collection().findOne()' })
  }
});

app.put('/edit', async function (req, resp) {
  try {
    const posts = db.collection(POSTS);

    await posts.updateOne(
      { _id: parseInt(req.body.id) },
      { $set: { title: req.body.title, date: req.body.date } }
    );

    console.log('app.put.edit: Update complete');
    resp.redirect('/list');    // ✅ Correct
  } catch (e) {
    console.error(e);
    resp.status(500).send('Update error');
  }
});
