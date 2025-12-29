/**
 * Database Bridge
 * 
 * Selects and initializes the appropriate database adapter based on 
 * environment configuration. This allows easy switching between databases
 * without changing application code.
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
import uri from './uri.js'

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
//dotenv.config({ quiet: true, path: path.join(__dirname, '..', '.env') });

/**
 * Create and return the appropriate database adapter
 * based on environment configuration
 */
function createDatabaseAdapter() {
  // Read database type from environment variable
  // Default to 'sqlite' if not specified
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  console.log(`Initializing database adapter: ${dbType}`);
  
  switch (dbType.toLowerCase()) {
    case 'mongodb':
      return createMongoDBAdapter();
      
    case 'sqlite':
      return createSQLiteAdapter();
      
    default:
      console.warn(`Unknown DB_TYPE: ${dbType}. Falling back to SQLite.`);
      return createSQLiteAdapter();
  }
}

/**
 * Create MongoDB adapter with configuration from environment
 */
function createMongoDBAdapter() {
  const databasename = process.env.MONGO_DATABASE || 'todoapp';
  return new MongoDBAdapter(uri, databasename);
}

/**
 * Create SQLite adapter with configuration from environment
 */
function createSQLiteAdapter() {
  const dbPath = process.env.SQLITE_PATH || 
                 path.join(__dirname, '..', 'todoapp.sqlite');
  
  return new SQLiteAdapter(dbPath);
}

// Create the database instance
const dbAdapter = createDatabaseAdapter();

/**
 * Helper function to ensure database is connected before operations
 */
let isConnected = false;

async function ensureConnected() {
  if (!isConnected) {
    await dbAdapter.connect();
    isConnected = true;
  }
}

/**
 * Export a wrapped database object that ensures connection
 * This makes the API more convenient to use
 */
export const db = {
  // Original methods that require manual connection management
  connect: () => {
    isConnected = true;
    return dbAdapter.connect();
  },
  
  disconnect: () => {
    isConnected = false;
    return dbAdapter.disconnect();
  },
  
  // Auto-connecting wrapper methods
  findAll: async (...args) => {
    await ensureConnected();
    return dbAdapter.findAll(...args);
  },
  
  findOne: async (...args) => {
    await ensureConnected();
    return dbAdapter.findOne(...args);
  },
  
  insertOne: async (...args) => {
    await ensureConnected();
    return dbAdapter.insertOne(...args);
  },
  
  updateOne: async (...args) => {
    await ensureConnected();
    return dbAdapter.updateOne(...args);
  },
  
  deleteOne: async (...args) => {
    await ensureConnected();
    return dbAdapter.deleteOne(...args);
  },
  
  getNextId: async (...args) => {
    await ensureConnected();
    return dbAdapter.getNextId(...args);
  },
  
  // Export the raw adapter for advanced usage
  adapter: dbAdapter
};

export default db;
