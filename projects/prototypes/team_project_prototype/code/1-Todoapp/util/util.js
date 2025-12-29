import { getPostsCollection, getCounterCollection } from './db.js';

export async function runListGet(_, resp) {
  try {
    const posts = getPostsCollection();
    const res = await posts.find().toArray();
    const query = { posts: res };
    resp.render('list.ejs', query)
  } catch (e) {
    console.error(e);
  }
}

export async function runAddPost(req, resp) {
  try {
    const counter = getCounterCollection();
    const posts = getPostsCollection();

    // 1. Increase counter and get the NEW value in one atomic step
    const result = await counter.findOneAndUpdate(
      { name: 'count' },
      { $inc: { count: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    const newId = result.count; // now safe to access

    // 2. Insert new post using the incremented ID
    const newPost = {
      _id: newId,
      title: req.body.title,
      date: req.body.date
    };

    await posts.insertOne(newPost);

  } catch (e) {
    console.error(e);
  }
}