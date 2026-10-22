const { getDB } = require('./util/db');

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';

let db;

async function initialize() {
  db = await getDB(DATABASE);
}

initialize();

// Install express
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// callback functions
app.set('view engine', 'ejs');

app.listen(5500, function () {
  console.log('listening on 5500');
});

app.get('/', function (req, resp) {
  resp.render('write.ejs');
});

app.post('/add', function (req, resp) {
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
    resp.status(500).send('Error: could not store the data');
  }
}

app.get('/list', function (req, resp) {
  runListGet(req, resp);
});

async function runListGet(req, resp) {
  try {
    const posts = db.collection(POSTS);
    const res = await posts.find().toArray();
    const query = { posts: res };
    resp.render('list.ejs', query);
  } catch (e) {
    console.error(e);
    resp.status(500).send('Error: could not read the list');
  }
}

app.delete('/delete', async function (req, resp) {
  const id = parseInt(req.body._id, 10); // the ID arrives as a string, so change it into an int value
  if (Number.isNaN(id)) return resp.status(400).send('Invalid id');

  try {
    const posts = db.collection(POSTS);
    await posts.deleteOne({ _id: id });

    console.log('Delete complete');
    resp.send('Delete complete');
  } catch (e) {
    console.error(e);
    resp.status(500).send('Error: could not delete the post');
  }
});

app.get('/edit/:id', async function (req, resp) {
  try {
    const posts = db.collection(POSTS);
    const res = await posts.findOne({ _id: parseInt(req.params.id, 10) });
    if (res != null) {
      resp.render('edit.ejs', { data: res });
    } else {
      resp.status(404).send({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    resp.status(500).send({ error: 'Error from db.collection().findOne()' });
  }
});

app.put('/edit', async function (req, resp) {
  try {
    const posts = db.collection(POSTS);

    await posts.updateOne(
      { _id: parseInt(req.body.id, 10) },
      { $set: { title: req.body.title, date: req.body.date } }
    );

    console.log('app.put.edit: Update complete');
    resp.redirect('/list');    // go back to the list page
  } catch (e) {
    console.error(e);
    resp.status(500).send('Update error');
  }
});
