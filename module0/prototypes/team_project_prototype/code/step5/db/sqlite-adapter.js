/**
 * SQLite Adapter for ORDB
 *
 * Implements the ORDB interface with the sqlite3 library.
 * sqlite3 uses callbacks, so every method wraps its callback in a Promise
 * (Promise Wrapper pattern):
 *   - the Promise executor runs immediately and starts the query,
 *   - the callback runs LATER, when the query is finished,
 *   - resolve/reject settle the Promise, so `await` can continue.
 */

import sqlite3 from 'sqlite3';
import { ORDB } from './ordb.js';

const { Database } = sqlite3.verbose();

// Table and column names cannot be passed as "?" parameters, so they are put into the SQL text.
// We only accept simple names, otherwise a name like "posts; DROP TABLE posts" would be SQL injection.
const IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

function ident(name) {
  if (!IDENTIFIER.test(name)) {
    throw new Error(`Invalid table or column name: ${name}`);
  }
  return name;
}

// Build " WHERE a = ? AND b = ?" from a filter object like { a: 1, b: 2 }
function buildWhere(filter = {}) {
  const keys = Object.keys(filter);
  if (keys.length === 0) return { clause: '', params: [] };

  const clause = ' WHERE ' + keys.map((key) => `${ident(key)} = ?`).join(' AND ');
  const params = keys.map((key) => filter[key]);
  return { clause, params };
}

export class SQLiteAdapter extends ORDB {
  constructor(dbPath) {
    super();
    this.dbPath = dbPath;
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbPath, (err) => {
        if (err) return reject(err);

        // SQLite has a fixed schema: the table must exist before it is used
        const sql = `
          PRAGMA foreign_keys = ON;
          CREATE TABLE IF NOT EXISTS posts (
            _id   INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            date  TEXT
          );
        `;

        this.db.exec(sql, (err2) => {
          if (err2) return reject(err2);
          console.log(`SQLite connected successfully (${this.dbPath})`);
          resolve();
        });
      });
    });
  }

  async disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();

      this.db.close((err) => {
        if (err) return reject(err);
        this.db = null;
        console.log('SQLite disconnected');
        resolve();
      });
    });
  }

  async findAll(collection, filter = {}, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const { clause, params } = buildWhere(filter);
        let sql = `SELECT * FROM ${ident(collection)}${clause}`;

        if (options.sort) {
          const order = Object.entries(options.sort)
            .map(([field, dir]) => `${ident(field)} ${dir === -1 ? 'DESC' : 'ASC'}`)
            .join(', ');
          if (order) sql += ` ORDER BY ${order}`;
        }
        if (options.limit) {
          sql += ` LIMIT ${Number(options.limit)}`;
        }

        this.db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async findOne(collection, filter) {
    return new Promise((resolve, reject) => {
      try {
        const { clause, params } = buildWhere(filter);
        const sql = `SELECT * FROM ${ident(collection)}${clause} LIMIT 1`;

        // Start the query (non-blocking): the callback runs LATER, when it is finished
        this.db.get(sql, params, (err, row) => {
          if (err) reject(err); // tell the Promise: "failed"
          else resolve(row || null); // tell the Promise: "success with data"
        });
        // The function continues here immediately; the Promise is still pending
      } catch (e) {
        reject(e);
      }
    });
  }

  // Returns the inserted record with its (auto-generated) _id
  async insertOne(collection, data) {
    return new Promise((resolve, reject) => {
      try {
        const keys = Object.keys(data);
        if (keys.length === 0) return reject(new Error('insertOne() needs data'));

        const columns = keys.map(ident).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO ${ident(collection)} (${columns}) VALUES (${placeholders})`;

        // "function" (not an arrow function) is required to use this.lastID
        this.db.run(sql, keys.map((key) => data[key]), function (err) {
          if (err) reject(err);
          else resolve({ ...data, _id: data._id ?? this.lastID });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // Returns the updated record, or null if nothing matched
  async updateOne(collection, filter, update) {
    const setKeys = Object.keys(update);
    if (setKeys.length === 0) return this.findOne(collection, filter);

    return new Promise((resolve, reject) => {
      try {
        if (Object.keys(filter).length === 0) {
          return reject(new Error('updateOne() needs a filter'));
        }

        const setClause = setKeys.map((key) => `${ident(key)} = ?`).join(', ');
        const { clause, params } = buildWhere(filter);
        const sql = `UPDATE ${ident(collection)} SET ${setClause}${clause}`;

        this.db.run(sql, [...setKeys.map((key) => update[key]), ...params], (err) => {
          if (err) return reject(err);
          // Fetch and return the updated record (null when nothing matched)
          this.findOne(collection, filter).then(resolve, reject);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // Returns true if a record was deleted
  async deleteOne(collection, filter) {
    return new Promise((resolve, reject) => {
      try {
        if (Object.keys(filter).length === 0) {
          return reject(new Error('deleteOne() needs a filter'));
        }

        const { clause, params } = buildWhere(filter);
        const sql = `DELETE FROM ${ident(collection)}${clause}`;

        this.db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // SQLite generates ids itself (AUTOINCREMENT); this is provided for the ORDB interface
  async getNextId(collection) {
    return new Promise((resolve, reject) => {
      try {
        const sql = `SELECT MAX(_id) AS maxId FROM ${ident(collection)}`;

        this.db.get(sql, [], (err, row) => {
          if (err) reject(err);
          else resolve(row && row.maxId ? row.maxId + 1 : 1);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getType() {
    return 'SQLite';
  }
}

export default SQLiteAdapter;
