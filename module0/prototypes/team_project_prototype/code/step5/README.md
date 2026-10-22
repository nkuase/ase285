# Step 5: Database Abstraction Layer (ORDB)

**Goal**: one application code that works with MongoDB and SQLite. Switch with one line in `.env`.

## Run

```bash
./run.sh            # uses .env in this directory; http://localhost:5500
```

```bash
# .env
DB_TYPE=sqlite      # or: mongodb (then fill in MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER)
```

`step5/.env` is read from this directory (steps 1-3 read `code/.env`). Restart the server after a change.

## Architecture

```text
routes/api.js, routes/router.js     (application code: no database-specific code)
        |
   ORDB interface (db/ordb.js)
        |
  +-----+------+
  |            |
MongoDBAdapter SQLiteAdapter
```

## Files

| File | What it does |
|------|--------------|
| `db/ordb.js` | abstract base class: `connect`, `findAll`, `findOne`, `insertOne`, `updateOne`, `deleteOne`, `getNextId`, `disconnect`, `getType` |
| `db/mongodb-adapter.js` | implements it with the MongoDB driver (already Promises) |
| `db/sqlite-adapter.js` | implements it with sqlite3 (callbacks wrapped in Promises) |
| `db/bridge.js` | factory: picks the adapter from `DB_TYPE` and exports `db` |
| `db/uri.js` | loads `.env` and builds the MongoDB connection string (`null` if not configured) |

## Design patterns

- **Repository**: the application talks to an interface, not to a database.
- **Adapter**: each adapter converts the ORDB calls to one database API.
- **Factory** (`bridge.js`): creates the right adapter.
- **Promise wrapper** (`sqlite-adapter.js`): the Promise executor runs immediately and starts the query; the callback runs later and calls `resolve` or `reject`.

## Key ideas

- Table and column names cannot be `?` parameters, so `sqlite-adapter.js` accepts only simple names (`ident()`), otherwise they would be an SQL injection hole.
- The MongoDB adapter never prints the connection string (it contains the password).
- To add a database (for example PostgreSQL): write a new adapter and add a `case` in `bridge.js`.

## Try it

- Run with `DB_TYPE=sqlite`, add posts, stop, run with `DB_TYPE=mongodb`: the same pages and API work, with a different data store.
