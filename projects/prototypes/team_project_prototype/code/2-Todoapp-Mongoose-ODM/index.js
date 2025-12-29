import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import Post from './models/Post.js';
import { getNextId } from './util/util.js';
import uri from './util/uri.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Connect to MongoDB using Mongoose
async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Initialize database connection
await connectDB();

// Start server
app.listen(5500, function () {
  console.log('Server listening on port 5500');
});

// Routes

// GET / - Show write form
app.get('/', function (req, res) {
  try {
    res.render('write.ejs');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error rendering page');
  }
});

// POST /add - Add new post
app.post('/add', async function (req, res) {
  try {
    const nextId = await getNextId();
    
    const newPost = new Post({
      _id: nextId,
      title: req.body.title,
      date: req.body.date,
    });

    await newPost.save();
    console.log('Post added successfully');
    res.redirect('/');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error adding post');
  }
});

// GET /list - Show all posts
app.get('/list', async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render('list.ejs', { posts: posts });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching posts');
  }
});

// DELETE /delete - Delete a post
app.delete('/delete', async function (req, res) {
  try {
    const postId = parseInt(req.body._id);
    await Post.findByIdAndDelete(postId);
    
    console.log('Delete complete');
    res.send('Delete complete');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error deleting post');
  }
});

// GET /detail/:id - Show post details
app.get('/detail/:id', async function (req, res) {
  try {
    const postId = parseInt(req.params.id);
    const post = await Post.findById(postId);
    
    if (post) {
      console.log('Detail page - Post found:', { data: post });
      res.render('detail.ejs', { data: post });
    } else {
      console.log('Post not found');
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post details');
  }
});

// GET /edit/:id - Show edit form
app.get('/edit/:id', async function (req, res) {
  try {
    const postId = parseInt(req.params.id);
    const post = await Post.findById(postId);
    
    if (post) {
      console.log('Edit page - Post found:', { data: post });
      res.render('edit.ejs', { data: post });
    } else {
      console.log('Post not found');
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post for editing');
  }
});

// PUT /edit - Update a post
app.put('/edit', async function (req, res) {
  try {
    const postId = parseInt(req.body.id);
    
    await Post.findByIdAndUpdate(
      postId,
      {
        title: req.body.title,
        date: req.body.date,
      }
    );
    
    console.log('Update complete');
    res.redirect('/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating post');
  }
});

// API route - GET /listjson - Return posts as JSON
app.get('/listjson', async function (req, res) {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching posts');
  }
});
