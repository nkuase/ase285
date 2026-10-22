// db.js
import { MongoClient } from 'mongodb';
import { databasename } from './uri.js';

export const POSTS = 'posts';
export const COUNTER = 'counter';

let db = null;

// Create and reuse a single database connection.
// The returned db is NOT imported by the routers: index.js passes it to them (Dependency Injection).
export async function connect(uri, database = databasename) {
  if (db) return db;

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(database);
  return db;
}
