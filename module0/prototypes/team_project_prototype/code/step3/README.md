# Step 3: Todo App with REST API

**Goal**: separate the routes into modules and add a REST API (`/api/posts`).

## Run

```bash
./run.sh            # needs code/.env (copy ../.env.example); http://localhost:5500
```

- Web UI: <http://localhost:5500/>
- REST API: <http://localhost:5500/api/posts>

## What is new

| File | What it does |
|------|--------------|
| `routes/router.js` | Web UI routes (HTML pages and redirects) |
| `routes/api.js` | REST API routes (JSON) |
| `index.js` | `app.use('/api', createApiRouter(db))` and `app.use('/', createRouter(db))` |
| `util/db.js` | `connect(uri)` returns the database handle |

## Key ideas

- **`app.use(path, router)`** mounts a router under a URL prefix: two URL spaces (`/api/*` = JSON, `/*` = HTML).
- **Factory function + Dependency Injection**: `createRouter(db)` receives the database instead of importing it.
- **Status codes**: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error.
- **Same counter for both**: the web UI and the API use `getNextId(db)`, so ids never collide.
- **`express.json()`** is needed to read JSON bodies (without it `req.body` is empty).

## Try it

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
