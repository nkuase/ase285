import mongoose from 'mongoose';

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

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
