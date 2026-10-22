import { POSTS, COUNTER } from './db.js';

// Auto-increment ID: a separate "counter" collection stores the current count.
// The web UI routes and the API routes both use it, so their ids never collide.
export async function getNextId(db) {
  const result = await db.collection(COUNTER).findOneAndUpdate(
    { _id: 'postId' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  return result.seq;
}

// Errors are NOT caught here: the route catches them and sends the error response.

export async function runListGet(db, resp) {
  const posts = await db.collection(POSTS).find().sort({ _id: 1 }).toArray();
  resp.render('list.ejs', { posts });
}

export async function runAddPost(db, req) {
  const newPost = {
    _id: await getNextId(db),
    title: req.body.title,
    date: req.body.date,
  };

  await db.collection(POSTS).insertOne(newPost);
  return newPost;
}
