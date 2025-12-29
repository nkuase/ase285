import { getPostsCollection, getCounterCollection } from './db.js';

export async function runListGet(_, resp) {
  try {
    const res = await getPostsCollection().find().toArray();
    const query = { posts: res };
    resp.render('list.ejs', query)
  } catch (e) {
    console.error(e);
  }
}

export async function getNextId() {

  const result = await getCounterCollection().findOneAndUpdate(
    { _id: "postId" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );

  return result.value.seq;
}

export async function runAddPost(req) {
  const largestId = await getNextId();

  const query = {
    _id: largestId,
    title: req.body.title,
    date: req.body.date,
  };

  const res = await getPostsCollection().insertOne(query);
  return res;
}