import express from 'express';
import methodOverride from 'method-override';

import { getDB, getPostsCollection } from './util/db.js';
import { runListGet, runAddPost } from './util/util.js';

const PORT = process.env.PORT || 5500;

await getDB(); // connect to MongoDB once (top-level await)
const posts = getPostsCollection();

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); // HTML forms and jQuery ajax (key=value)
app.use(express.json()); // JSON bodies (for example from fetch or curl)
app.use('/public', express.static('public'));
app.use(methodOverride('_method')); // <form action="/edit?_method=PUT"> becomes PUT /edit

// The id arrives as a string ("5"): convert it to a number (NaN means "not a number").
const toId = (value) => parseInt(value, 10);

// ---------------------------------------------------------------- Create
app.post('/add', async (req, res) => {
  try {
    await runAddPost(req);
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: failed to add the post');
  }
});

// ---------------------------------------------------------------- Read
app.get('/', (req, res) => {
  res.render('write.ejs');
});

app.get('/list', async (req, res) => {
  try {
    await runListGet(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: failed to load the posts');
  }
});

app.get('/detail/:id', async (req, res) => {
  try {
    const id = toId(req.params.id); // req.params.id contains the value of :id
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const data = await posts.findOne({ _id: id });
    if (!data) return res.status(404).send('Post not found');

    res.render('detail.ejs', { data });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error from posts.findOne()');
  }
});

app.get('/listjson', async (req, res) => {
  try {
    const data = await posts.find().sort({ _id: 1 }).toArray();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ---------------------------------------------------------------- Update
app.get('/edit/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const data = await posts.findOne({ _id: id });
    if (!data) return res.status(404).send('Post not found');

    res.render('edit.ejs', { data });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error from posts.findOne()');
  }
});

app.put('/edit', async (req, res) => {
  try {
    const id = toId(req.body.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    await posts.updateOne(
      { _id: id },
      { $set: { title: req.body.title, date: req.body.date } }
    );
    res.redirect('/list');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: failed to update the post');
  }
});

// ---------------------------------------------------------------- Delete
app.delete('/delete', async (req, res) => {
  try {
    const id = toId(req.body._id); // the body._id is a string, so change it into a number
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    await posts.deleteOne({ _id: id });
    res.send('Delete complete');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error: failed to delete the post');
  }
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
