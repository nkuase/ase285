# todo-cli-sqlite

Minimal Node.js CLI app with SQLite that implements CRUD for a `posts` table:
- `_id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `date` (TEXT)

## Setup

```bash
unzip todo_cli_sqlite.zip
cd todo_cli_sqlite
npm install
```

## Usage

```bash
node index.js init
node index.js create "work" "today"
node index.js list
node index.js get 1
node index.js update 1 "homework" "tomorrow"
node index.js delete 1
```

Output is JSON where appropriate.

The database file `todo.sqlite` will be created in this folder.

—

path is built into Node.js itself, while sqlite3 is a third-party package.