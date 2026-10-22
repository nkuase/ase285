# Step 1: Simplistic Todo App

**Goal**: a 3-tier Todo app (browser, Express server, MongoDB) with the native MongoDB driver.

## Run

```bash
./run.sh            # needs code/.env (copy ../.env.example); http://localhost:5500
npm test            # unit tests (no database needed)
```

## Files

| File | What it does |
|------|--------------|
| `index.js` | Express setup and all the routes |
| `util/uri.js` | builds the MongoDB connection string from `.env` |
| `util/db.js` | one shared connection: `getDB()`, `getPostsCollection()`, `getCounterCollection()` |
| `util/util.js` | `runListGet`, `runAddPost` (the data model of a post) |
| `views/*.ejs` | pages (Bootstrap + EJS) |
| `tests/` | `db.simple.test.js` (testing basics), `db.test.js` (mocking MongoDB) |

## Routes

| Method | URL | Action |
|--------|-----|--------|
| POST | `/add` | create a post, redirect to `/` |
| GET | `/`, `/list`, `/detail/:id`, `/listjson` | read |
| GET | `/edit/:id` | edit form |
| PUT | `/edit` | update, redirect to `/list` |
| DELETE | `/delete` | delete (called with AJAX from the list page) |

## Key ideas

- **Auto-increment id**: a `counter` collection with one document `{ _id: 'postId', seq }`; `findOneAndUpdate` with `$inc` is atomic.
- **method-override**: an HTML form can only send GET and POST, so `?_method=PUT` turns a POST into PUT.
- **The id is a string**: `req.params.id` and `req.body._id` must be converted with `parseInt`.
- **Errors**: `util.js` does not catch errors; the route catches them and always sends a response.

## Try it

- Add a post whose title has spaces, then edit it: the title is kept (the `value` attribute is in quotes).
- `curl http://localhost:5500/listjson`
