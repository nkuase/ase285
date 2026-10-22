/**
 * Main Server File - Todo App with ORDB
 *
 * The ORDB (Object-Relational Database) layer lets the same application code work with
 * different database systems (MongoDB, SQLite).
 *
 * To switch databases, set DB_TYPE in the .env file (or in the environment):
 *   DB_TYPE=sqlite    (default)
 *   DB_TYPE=mongodb
 */

import express from 'express';
import methodOverride from 'method-override';

import { db } from './db/bridge.js';
import { createApiRouter } from './routes/api.js';
import { createRouter } from './routes/router.js';

const PORT = process.env.PORT || 5500;

// ========== Database ==========
await db.connect();
console.log(`Using database: ${db.getType()}`);

// ========== App Configuration ==========
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true })); // HTML forms and jQuery ajax (key=value)
app.use(express.json()); // JSON bodies: needed by the REST API (curl, fetch, ...)
app.use(methodOverride('_method')); // <form action="/edit?_method=PUT"> becomes PUT /edit
app.use('/public', express.static('public'));

// ========== Routes ==========
// The routers only know the ORDB interface, not which database is behind it.
app.use('/api', createApiRouter(db));
app.use('/', createRouter(db));

// ========== Server Startup ==========
const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// ========== Graceful Shutdown ==========
async function shutdown() {
  console.log('\nShutting down gracefully...');
  server.close();
  await db.disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
