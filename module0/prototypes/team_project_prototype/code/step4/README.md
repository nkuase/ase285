# Step 4: Todo App with SQLite

**Goal**: replace MongoDB with SQLite (SQL, file-based, no server needed).

## Run

```bash
./run.sh            # no configuration; http://localhost:5500
```

The database file `todoapp.sqlite` is created automatically in this directory.

## What is new

| File | What it does |
|------|--------------|
| `util/db.js` | opens the database file and creates the `posts` table (fixed schema) |
| `routes/router.js` | Web UI routes with SQL queries |
| `routes/api.js` | REST API routes with SQL queries |

## MongoDB vs SQLite

| | MongoDB | SQLite |
|--|---------|--------|
| Data | documents in collections | rows in tables |
| Schema | flexible | fixed (`CREATE TABLE`) |
| Id | counter collection | `INTEGER PRIMARY KEY AUTOINCREMENT` (`this.lastID`) |
| API | Promises | callbacks |

## The sqlite3 methods

- `db.run(sql, params, cb)`: INSERT, UPDATE, DELETE (`this.lastID`, `this.changes`)
- `db.all(sql, params, cb)`: many rows
- `db.get(sql, params, cb)`: one row
- `db.exec(sql, cb)`: run a SQL script

## Key ideas

- **Parameterized queries**: always use `?` placeholders, never put user input into the SQL text (SQL injection).
- **Callbacks**: the library has no Promises. `this.lastID` and `this.changes` need a `function`, not an arrow function.
- Step 5 wraps these callbacks into Promises.

## Try it

- Open `todoapp.sqlite` with a SQLite browser tool and look at the `posts` table.
