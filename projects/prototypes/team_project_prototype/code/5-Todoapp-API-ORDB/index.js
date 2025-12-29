/**
 * Main Server File - Todoapp with ORDB
 * 
 * This server demonstrates the Object-Relational Database Bridge (ORDB) pattern,
 * which allows seamless switching between different database systems (MongoDB, SQLite)
 * without changing application code.
 * 
 * To switch databases, simply set the DB_TYPE environment variable:
 *   - DB_TYPE=mongodb npm start  (uses MongoDB)
 *   - DB_TYPE=sqlite npm start   (uses SQLite - default)
 */

import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

// Import routes
import { createApiRouter } from './routes/api.js';
import { createRouter } from './routes/router.js';

// Import database utilities
import { db, initializeDatabase, closeDatabase } from './util/db.js';

// ========== App Configuration ==========
const app = express();
const PORT = process.env.PORT || 5500;

// ========== Middleware Setup ==========
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static('public'));

// ========== Routes ==========
app.use('/api', createApiRouter(db));
app.use('/', createRouter(db));

// ========== Server Startup ==========

async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// ========== Graceful Shutdown ==========

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer();
