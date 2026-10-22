# Team Project Prototype - Source Code

A ToDo app built step by step. Each `stepN` directory is a complete, runnable project.

| Step | Topic | Database access |
|------|-------|-----------------|
| step1 | Simplistic Todo App | Native MongoDB driver, all routes in `index.js` |
| step2 | Mongoose ODM | Mongoose schemas and models |
| step3 | REST API | Separated routers (`routes/api.js`, `routes/router.js`), dependency injection |
| step4 | SQLite | `sqlite3` (callback-based API) |
| step5 | ORDB abstraction layer | Adapter + Repository patterns, switch DB with `.env` |

## Run a step

```bash
cd step1            # or step2 ... step5
npm install
npm start           # or: npm run dev (nodemon)
```

The server listens on http://localhost:5500 (override with the `PORT` environment variable).

## Run with run.sh

Each step has its own `run.sh`. It checks the `.env` file, runs `npm install` if needed, and starts the server.

```bash
chmod +x step*/run.sh    # only needed once

./step1/run.sh
./step2/run.sh
./step3/run.sh
./step4/run.sh
./step5/run.sh
```

All steps use the same port (5500), so run one at a time (Ctrl+C to stop).
Use `PORT=5600 ./step3/run.sh` to change the port.
step1-3 need `code/.env`, and step5 needs `step5/.env`.

## Configuration

- step1, step2, step3 (MongoDB): copy `code/.env.example` to `code/.env` and fill it in.
  These steps load `../.env`, so one file in this directory is shared by all three.
- step4 (SQLite): no configuration. `todoapp.sqlite` is created automatically.
- step5: copy `step5/.env.example` to `step5/.env` and set `DB_TYPE=sqlite` or `DB_TYPE=mongodb`.

## Differences from the original code

The views (Bootstrap + EJS), the routes, and the directory structure follow the original code.
These are the changes (bug fixes and simplifications for teaching):

| Area | Change |
|------|--------|
| step1 | `DELETE /delete` used an undefined `POSTS` and never answered, and the JSON body was never parsed; the detail page posted to a route that does not exist; the `value=` attributes had no quotes (titles with spaces were cut); an undefined `error` was logged; `npm start` needed a globally installed nodemon |
| step1 tests | `db.test.js` needed the `--experimental-test-module-mocks` flag (now in `npm test`); test 3 was an empty `assert.ok(true)`, now it checks the error |
| step3 | `/list` crashed (`runListGet` was not imported); `updateOne` used a callback (removed in mongodb 5+); `result.value` does not exist in mongodb 6; the API computed ids as max + 1 and collided with the counter; JSON bodies were not parsed; `run.sh` started a missing `main.js` |
| step4 | `body-parser` was imported but not in `package.json`; JSON bodies were not parsed |
| step5 | `uri.js` threw an error in SQLite mode when the MongoDB variables were missing; the MongoDB adapter printed the connection string (with the password); SQL injection through table and column names; `result.value` (mongodb 4) with the mongodb 6 driver |
| All | `mongodb` ^6 (`result.seq`), one counter format (`{ _id: 'postId', seq }`), `express.urlencoded` + `express.json` instead of `body-parser`, `nodemon` as a dev dependency, `encodeURIComponent` for the password, `MONGO_CLUSTER` as the cluster id or the full host, id validation (400) and not found (404) |
| Docs | `README.md` per step; the original `env` file is now `.env.example` |

Not included: `public/todo.png` (binary file), `MIGRATION.md` (a developer note), and the unrelated `readme.txt` files.

## Tests

- step1: `npm test` runs `db.simple.test.js` (testing basics) and `db.test.js` (MongoDB is mocked, so no database is needed; Node.js 22.3+ is required for `mock.module`).
- step3 and later: try the REST API with curl.

```bash
curl http://localhost:5500/api/posts
curl -X POST http://localhost:5500/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","date":"2024-01-01"}'
curl -X PUT http://localhost:5500/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
curl -X DELETE http://localhost:5500/api/posts/1
```
