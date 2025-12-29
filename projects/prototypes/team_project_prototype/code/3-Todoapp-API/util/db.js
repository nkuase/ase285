// db.js
import { MongoClient } from 'mongodb';

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';

let db = null;

// Create and reuse a single database connection
export async function connect(uri) {
  if (db) return db;

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(DATABASE);
  return db;
}

// Return the "posts" collection
export function getPostsCollection() {
  return db.collection(POSTS);
}

// Return the "counter" collection
export function getCounterCollection() {
  return db.collection(COUNTER);
}