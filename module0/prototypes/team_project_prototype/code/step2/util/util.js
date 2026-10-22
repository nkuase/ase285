import Counter from '../models/Counter.js';

// Auto-increment ID using the Counter model.
export async function getNextId() {
  const result = await Counter.findByIdAndUpdate(
    'postId',
    { $inc: { seq: 1 } },
    {
      new: true,    // Return the updated document
      upsert: true, // Create it if it does not exist
    }
  );

  return result.seq;
}
