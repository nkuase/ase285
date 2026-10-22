import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

import Post from './models/Post.js';
import { getNextId } from './util/util.js';
import uri, { databasename } from './util/uri.js';

const PORT = process.env.PORT || 5500;

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // HTML forms and jQuery ajax (key=value)
app.use(express.json()); // JSON bodies (for example from fetch or curl)
app.use('/public', express.static('public'));
app.use(methodOverride('_method')); // <form action="/edit?_method=PUT"> becomes PUT /edit

// Connect to MongoDB using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(uri, { dbName: databasename });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Initialize the database connection (top-level await)
await connectDB();

// The id arrives as a string ("5"): convert it to a number (NaN means "not a number").
const toId = (value) => parseInt(value, 10);

// Mongoose validation errors (and a wrong id type) are the client's fault: 400, otherwise 500.
function sendError(res, e, message) {
  console.error(e);
  const status = e.name === 'ValidationError' || e.name === 'CastError' ? 400 : 500;
  res.status(status).send(message);
}

// ---------------------------------------------------------------- Create
app.post('/add', async (req, res) => {
  try {
    const nextId = await getNextId();

    const newPost = new Post({
      _id: nextId,
      title: req.body.title,
      date: req.body.date,
    });

    await newPost.save(); // the schema validates the data here
    res.redirect('/');
  } catch (e) {
    sendError(res, e, 'Error adding post');
  }
});

// ---------------------------------------------------------------- Read
app.get('/', (req, res) => {
  res.render('write.ejs');
});

app.get('/list', async (req, res) => {
  try {
    // lean(): plain JavaScript objects (faster, and enough for the template)
    const posts = await Post.find({}).sort({ _id: 1 }).lean();
    res.render('list.ejs', { posts });
  } catch (e) {
    sendError(res, e, 'Error fetching posts');
  }
});

app.get('/detail/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const data = await Post.findById(id).lean();
    if (!data) return res.status(404).send('Post not found');

    res.render('detail.ejs', { data });
  } catch (e) {
    sendError(res, e, 'Error fetching post details');
  }
});

app.get('/listjson', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ _id: 1 });
    res.json(posts);
  } catch (e) {
    sendError(res, e, 'Error fetching posts');
  }
});

// ---------------------------------------------------------------- Update
app.get('/edit/:id', async (req, res) => {
  try {
    const id = toId(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const data = await Post.findById(id).lean();
    if (!data) return res.status(404).send('Post not found');

    res.render('edit.ejs', { data });
  } catch (e) {
    sendError(res, e, 'Error fetching post for editing');
  }
});

app.put('/edit', async (req, res) => {
  try {
    const id = toId(req.body.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const updated = await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        date: req.body.date,
      },
      { runValidators: true } // validate the new values with the schema
    );
    if (!updated) return res.status(404).send('Post not found');

    res.redirect('/list');
  } catch (e) {
    sendError(res, e, 'Error updating post');
  }
});

// ---------------------------------------------------------------- Delete
app.delete('/delete', async (req, res) => {
  try {
    const id = toId(req.body._id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    await Post.findByIdAndDelete(id);
    res.send('Delete complete');
  } catch (e) {
    sendError(res, e, 'Error deleting post');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
