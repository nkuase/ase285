/**
 * Database Bridge
 *
 * Selects the database adapter from the environment (DB_TYPE) and exports it as `db`.
 * The rest of the application only uses the ORDB interface, so switching databases
 * needs no change in the application code.
 *
 * Usage:
 *   import { db } from './db/bridge.js';
 *   await db.connect();
 *   const posts = await db.findAll('posts');
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { MongoDBAdapter } from './mongodb-adapter.js';
import { SQLiteAdapter } from './sqlite-adapter.js';
import uri, { databasename } from './uri.js'; // also loads the .env file

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Factory pattern: create the adapter that matches the configuration
function createDatabaseAdapter() {
  // Default to 'sqlite' if DB_TYPE is not specified
  const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

  switch (dbType) {
    case 'mongodb':
      if (!uri) {
        throw new Error(
          'DB_TYPE=mongodb needs MONGO_URI or MONGO_USER, MONGO_PASSWORD and MONGO_CLUSTER in .env'
        );
      }
      return new MongoDBAdapter(uri, databasename);

    case 'sqlite':
      return new SQLiteAdapter(sqlitePath());

    default:
      console.warn(`Unknown DB_TYPE: ${dbType}. Falling back to SQLite.`);
      return new SQLiteAdapter(sqlitePath());
  }
}

// SQLITE_PATH is relative to the project root, wherever the server is started from
function sqlitePath() {
  return path.resolve(projectRoot, process.env.SQLITE_PATH || './todoapp.sqlite');
}

export const db = createDatabaseAdapter();

export default db;
