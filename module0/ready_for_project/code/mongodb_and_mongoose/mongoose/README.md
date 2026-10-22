# Mongoose Example

Accessing MongoDB with **Mongoose** (an ODM for MongoDB).

## Files

- `util/uri.js` — reads `MONGO_USER`, `MONGO_PASSWORD`, and `MONGO_CLUSTER` from `../.env` and builds the connection string.
- `util/db.js` — `getConn()` creates (and reuses) one Mongoose connection.
- `models/student.js` — the `Student` model (name, age, major).
- `ping.js` — checks that the connection works.
- `database.js` — inserts one student into the `nku_demo` database.

## Setup

```bash
cd mongoose
cp ../env ../.env     # then edit ../.env with your own values
npm install
```

## Run

```bash
node ping.js
node database.js      # or: npm start
```

The scripts read `../.env` relative to the directory where you run `node`, so run them from this directory.
