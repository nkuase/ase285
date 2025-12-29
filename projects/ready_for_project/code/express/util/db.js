// db.js (CommonJS)

const { MongoClient } = require("mongodb");
const { uri, databasename } = require("./uri.js"); // both are properties of module.exports

const DATABASE = databasename;
const POSTS = "posts";
const COUNTER = "counter";

let db = null;

// Create a single MongoClient instance
const client = new MongoClient(uri); // connection

// Create and reuse a single database connection
async function getDB(database = DATABASE) {
  if (db) return db;          // reuse existing connection

  await client.connect();     // connect once
  db = client.db(database);   // store db globally
  return db;
}

// Return the "posts" collection
function getPostsCollection() {
  if (!db) throw new Error("Database not connected. Call connect() first.");
  return db.collection(POSTS);
}

// Return the "counter" collection
function getCounterCollection() {
  if (!db) throw new Error("Database not connected. Call connect() first.");
  return db.collection(COUNTER);
}

module.exports = {
  client,
  getDB,
  getPostsCollection,
  getCounterCollection,
};