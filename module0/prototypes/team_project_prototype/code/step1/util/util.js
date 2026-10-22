import { getPostsCollection, getCounterCollection } from './db.js';

// Errors are NOT caught here: the route (index.js) catches them and sends the error response.
// (If we only logged the error here, the browser would wait forever for an answer.)

export async function runListGet(_, resp) {
  const posts = getPostsCollection();
  const res = await posts.find().sort({ _id: 1 }).toArray();
  resp.render('list.ejs', { posts: res });
}

export async function runAddPost(req) {
  const counter = getCounterCollection();
  const posts = getPostsCollection();

  // 1. Increase the counter and get the NEW value in one atomic step
  const result = await counter.findOneAndUpdate(
    { _id: 'postId' },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const newId = result.seq;

  // 2. Insert the new post (the data model) using the incremented ID
  const newPost = {
    _id: newId,
    title: req.body.title,
    date: req.body.date,
  };

  await posts.insertOne(newPost);
}
