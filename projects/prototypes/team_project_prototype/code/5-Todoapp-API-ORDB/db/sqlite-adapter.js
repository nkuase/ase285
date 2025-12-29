/**
 * SQLite Adapter for ORDB
 * 
 * Implements the ORDB interface for SQLite database operations.
 * Converts callback-based SQLite3 API to Promise-based ORDB interface.
 */

import sqlite3 from 'sqlite3';
import { ORDB } from './ordb.js';

const { Database } = sqlite3.verbose();

export class SQLiteAdapter extends ORDB {
  constructor(dbPath) {
    super();
    this.dbPath = dbPath;
    this.db = null;
  }

  /**
   * Connect to SQLite database
   */
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new Database(this.dbPath, (err) => {
        if (err) {
          console.error('Failed to open SQLite database:', err.message);
          reject(err);
        } else {
          console.log('SQLite connected successfully');
          this._initializeDatabase().then(resolve).catch(reject);
        }
      });
    });
  }

  /**
   * Initialize database tables
   */
  async _initializeDatabase() {
    return new Promise((resolve, reject) => {
      const sql = `
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS posts (
          _id   INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          date  TEXT
        );
      `;
      
      this.db.exec(sql, (err) => {
        if (err) {
          console.error('Failed to initialize database:', err.message);
          reject(err);
        } else {
          console.log('SQLite database initialized successfully');
          resolve();
        }
      });
    });
  }

  /**
   * Disconnect from SQLite database
   */
  async disconnect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
            reject(err);
          } else {
            console.log('SQLite disconnected');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Find all records in a table
   * Supports basic filtering and sorting
   */
  async findAll(collection, filter = {}, options = {}) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${collection}`;
      const params = [];
      
      // Build WHERE clause from filter
      const whereClauses = [];
      for (const [key, value] of Object.entries(filter)) {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      }
      
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      // Add sorting
      if (options.sort) {
        const sortClauses = [];
        for (const [key, direction] of Object.entries(options.sort)) {
          sortClauses.push(`${key} ${direction === -1 ? 'DESC' : 'ASC'}`);
        }
        if (sortClauses.length > 0) {
          sql += ` ORDER BY ${sortClauses.join(', ')}`;
        }
      }
      
      // Add limit
      if (options.limit) {
        sql += ` LIMIT ${options.limit}`;
      }
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Find one record by filter
   */
  async findOne(collection, filter) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${collection}`;
      const params = [];
      
      // Build WHERE clause
      const whereClauses = [];
      for (const [key, value] of Object.entries(filter)) {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      }
      
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      sql += ' LIMIT 1';
      
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Insert a new record
   * Returns the inserted record with auto-generated _id
   */
  async insertOne(collection, data) {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(data).filter(key => key !== '_id');
      const values = keys.map(key => data[key]);
      const placeholders = keys.map(() => '?').join(', ');
      
      const sql = `INSERT INTO ${collection} (${keys.join(', ')}) VALUES (${placeholders})`;
      
      this.db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          // Return the inserted document with its ID
          const result = { ...data, _id: this.lastID };
          resolve(result);
        }
      });
    });
  }

  /**
   * Update one record
   * Returns the updated record or null if not found
   */
  async updateOne(collection, filter, update) {
    const db = this.db;
    return new Promise((resolve, reject) => {
      const updateKeys = Object.keys(update);
      const updateValues = updateKeys.map(key => update[key]);
      const setClauses = updateKeys.map(key => `${key} = ?`).join(', ');
      
      // Build WHERE clause
      const whereClauses = [];
      const whereValues = [];
      for (const [key, value] of Object.entries(filter)) {
        whereClauses.push(`${key} = ?`);
        whereValues.push(value);
      }
      
      const sql = `UPDATE ${collection} SET ${setClauses} WHERE ${whereClauses.join(' AND ')}`;
      const params = [...updateValues, ...whereValues];
      
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          // Fetch and return the updated record
          const selectSql = `SELECT * FROM ${collection} WHERE ${whereClauses.join(' AND ')}`;
          db.get(selectSql, whereValues, (err2, row) => {
            if (err2) {
              reject(err2);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }

  /**
   * Delete one record
   * Returns true if deleted, false if not found
   */
  async deleteOne(collection, filter) {
    return new Promise((resolve, reject) => {
      const whereClauses = [];
      const whereValues = [];
      
      for (const [key, value] of Object.entries(filter)) {
        whereClauses.push(`${key} = ?`);
        whereValues.push(value);
      }
      
      const sql = `DELETE FROM ${collection} WHERE ${whereClauses.join(' AND ')}`;
      
      this.db.run(sql, whereValues, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Get next auto-increment ID
   * For SQLite, this is handled automatically, but we provide this
   * method for consistency with the ORDB interface
   */
  async getNextId(collection) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT MAX(_id) as maxId FROM ${collection}`;
      
      this.db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          const nextId = (row && row.maxId) ? row.maxId + 1 : 1;
          resolve(nextId);
        }
      });
    });
  }

  /**
   * Get the database type name
   */
  getType() {
    return 'SQLite';
  }
}

export default SQLiteAdapter;
