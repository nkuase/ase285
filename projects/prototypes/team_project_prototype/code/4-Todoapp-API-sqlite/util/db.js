import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import path from 'path';

// db.js
const { Database } = sqlite3;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../todoapp.sqlite');

// Create and open the database
export const db = new Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Initialize the posts table
function initializeDatabase() {
  const sql = `
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS posts (
      _id   INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date  TEXT
    );
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Failed to initialize database:', err.message);
    } else {
      console.log('Database initialized successfully');
    }
  });
}

// Initialize on load
initializeDatabase();
