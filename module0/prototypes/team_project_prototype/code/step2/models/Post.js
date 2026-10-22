import mongoose from 'mongoose';

// Schema: explicit data structure + validation (single source of truth).
const postSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// Model: the interface for database operations on the 'posts' collection.
const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
