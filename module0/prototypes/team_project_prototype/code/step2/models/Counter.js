import mongoose from 'mongoose';

// Separate model for auto-incrementing IDs.
const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema, 'counter');

export default Counter;
