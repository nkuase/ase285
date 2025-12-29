import Counter from '../models/Counter.js';

// Get the next auto-incremented ID for posts
export async function getNextId() {
  const result = await Counter.findByIdAndUpdate(
    'postId',
    { $inc: { seq: 1 } },
    { 
      new: true,  // Return the updated document
      upsert: true,  // Create if doesn't exist
    }
  );

  return result.seq;
}
