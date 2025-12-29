// index.js - Minimal CLI CRUD with SQLite
// .verbose(): turns on extra debugging output (helpful for development).
const sqlite3 = require('sqlite3').verbose();

// path is built into Node.js itself, so no dependency in package.json needed
const path = require('path');

const DB_PATH = path.join(__dirname, 'todo.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
});

function ensureTable(cb) {
  const sql = `
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS posts (
    _id   INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    date  TEXT
  );`;
  db.exec(sql, cb);
}

function cmdInit() {
  ensureTable((err) => {
    if (err) return console.error('Init error:', err.message);
    console.log('Initialized DB and ensured posts table exists.');
    db.close();
  });
}

function cmdCreate(title, date) {
  if (!title) {
    console.error('Usage: node index.js create "<title>" ["<date>"]');
    return db.close();
  }
  ensureTable((err) => {
    if (err) { console.error('Create/init error:', err.message); return db.close(); }
    const sql = 'INSERT INTO posts (title, date) VALUES (?, ?)';
    db.run(sql, [title, date || ''], function(err2) {
      if (err2) { console.error('Create error:', err2.message); return db.close(); }
      console.log(JSON.stringify({ _id: this.lastID, title, date: date || '' }, null, 2));
      db.close();
    });
  });
}

function cmdList() {
  ensureTable((err) => {
    if (err) { console.error('List/init error:', err.message); return db.close(); }
    db.all('SELECT _id, title, date FROM posts ORDER BY _id ASC', [], (err2, rows) => {
      if (err2) { console.error('List error:', err2.message); return db.close(); }
      console.log(JSON.stringify(rows, null, 2));
      db.close();
    });
  });
}

function cmdGet(idStr) {
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    console.error('Usage: node index.js get <id>');
    return db.close();
  }
  ensureTable((err) => {
    if (err) { console.error('Get/init error:', err.message); return db.close(); }
    db.get('SELECT _id, title, date FROM posts WHERE _id = ?', [id], (err2, row) => {
      if (err2) { console.error('Get error:', err2.message); return db.close(); }
      if (!row) console.log('null');
      else console.log(JSON.stringify(row, null, 2));
      db.close();
    });
  });
}

function cmdUpdate(idStr, title, date) {
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id) || title === undefined || date === undefined) {
    console.error('Usage: node index.js update <id> "<title>" "<date>"');
    return db.close();
  }
  ensureTable((err) => {
    if (err) { console.error('Update/init error:', err.message); return db.close(); }
    const sql = 'UPDATE posts SET title = ?, date = ? WHERE _id = ?';
    db.run(sql, [title, date, id], function(err2) {
      if (err2) { console.error('Update error:', err2.message); return db.close(); }
      if (this.changes === 0) {
        console.log('null');
        return db.close();
      }
      db.get('SELECT _id, title, date FROM posts WHERE _id = ?', [id], (err3, row) => {
        if (err3) { console.error('Fetch after update error:', err3.message); return db.close(); }
        console.log(JSON.stringify(row, null, 2));
        db.close();
      });
    });
  });
}

function cmdDelete(idStr) {
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    console.error('Usage: node index.js delete <id>');
    return db.close();
  }
  ensureTable((err) => {
    if (err) { console.error('Delete/init error:', err.message); return db.close(); }
    db.run('DELETE FROM posts WHERE _id = ?', [id], function(err2) {
      if (err2) { console.error('Delete error:', err2.message); return db.close(); }
      console.log(JSON.stringify({ ok: true, deletedCount: this.changes }, null, 2));
      db.close();
    });
  });
}

function help() {
  console.log(`
Minimal CLI CRUD with SQLite (posts: _id, title, date)

Commands:
  node index.js init
  node index.js create "<title>" ["<date>"]
  node index.js list
  node index.js get <id>
  node index.js update <id> "<title>" "<date>"
  node index.js delete <id>

Examples:
  node index.js init
  node index.js create "work" "today"
  node index.js list
  node index.js get 1
  node index.js update 1 "homework" "tomorrow"
  node index.js delete 1
  `);
  db.close();
}

const [,, cmd, ...args] = process.argv;
switch ((cmd || '').toLowerCase()) {
  case 'init':   cmdInit(); break;
  case 'create': cmdCreate(args[0], args[1]); break;
  case 'list':   cmdList(); break;
  case 'get':    cmdGet(args[0]); break;
  case 'update': cmdUpdate(args[0], args[1], args[2]); break;
  case 'delete': cmdDelete(args[0]); break;
  default:       help();
}

