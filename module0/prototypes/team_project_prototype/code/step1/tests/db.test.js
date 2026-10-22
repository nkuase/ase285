// db.test.js - Unit tests for the database utility functions (util/db.js)
// This demonstrates how to write unit tests with mocks in Node.js
//
// Run:  npm test
// (mock.module() is experimental: it needs Node.js 22.3+ and the flag
//  --experimental-test-module-mocks, which the "test" script of package.json already has.)

import { describe, it, before, after, mock } from 'node:test';
import assert from 'node:assert';

/**
 * TESTING STRATEGY:
 *
 * Unit tests should test individual functions in isolation.
 * We mock external dependencies (like MongoDB) to:
 * 1. Avoid connecting to a real database
 * 2. Make tests run faster
 * 3. Make tests more predictable
 */

describe('Database Utility Tests', () => {
  let dbModule;
  let mongodbMock;
  let mockClient;
  let mockDb;

  // Setup: runs before all tests
  before(async () => {
    // util/uri.js needs a connection string. Any value works, because MongoClient is mocked.
    process.env.MONGO_URI = 'mongodb://localhost:27017';

    // Mock objects that simulate MongoDB behavior
    mockDb = {
      collection: mock.fn((name) => ({ name })),
    };

    mockClient = {
      connect: mock.fn(async () => {}), // simulate a successful connection
      db: mock.fn(() => mockDb), // return the mock database
    };

    // Mock the MongoDB module: new MongoClient() returns our mockClient
    mongodbMock = mock.module('mongodb', {
      namedExports: {
        MongoClient: class {
          constructor() {
            return mockClient;
          }
        },
      },
    });

    // Now import our module (it will use the mocked MongoDB)
    dbModule = await import('../util/db.js');
  });

  // Cleanup: runs after all tests
  after(() => {
    mongodbMock.restore();
  });

  /**
   * TEST 1: getDB() should connect to the database
   */
  it('should connect to database and return db instance', async () => {
    const db = await dbModule.getDB();

    assert.ok(db, 'Database should be returned');
    assert.strictEqual(mockClient.connect.mock.calls.length, 1, 'connect() should be called once');
    assert.strictEqual(mockClient.db.mock.calls.length, 1, 'db() should be called once');
  });

  /**
   * TEST 2: getDB() should reuse the existing connection
   */
  it('should reuse existing database connection', async () => {
    const db1 = await dbModule.getDB();
    const db2 = await dbModule.getDB();

    assert.strictEqual(db1, db2, 'Should return the same db instance');

    // connect() was called once (in test 1) and must not be called again
    assert.strictEqual(mockClient.connect.mock.calls.length, 1, 'connect() should not be called again');
  });

  /**
   * TEST 3: getPostsCollection() should throw an error if not connected
   *
   * A fresh copy of the module (the "?fresh" query makes Node load it again)
   * has no connection yet, so the function must fail with a clear message.
   */
  it('should throw error when getting posts collection without connection', async () => {
    const freshModule = await import('../util/db.js?fresh');

    assert.throws(() => freshModule.getPostsCollection(), /not connected/i);
    assert.throws(() => freshModule.getCounterCollection(), /not connected/i);
  });

  /**
   * TEST 4: getPostsCollection() should return the posts collection
   */
  it('should return posts collection after connection', async () => {
    await dbModule.getDB(); // ensure connected
    const collection = dbModule.getPostsCollection();

    assert.ok(collection, 'Posts collection should be returned');
    assert.strictEqual(collection.name, 'posts', 'Collection name should be "posts"');
  });

  /**
   * TEST 5: getCounterCollection() should return the counter collection
   */
  it('should return counter collection after connection', async () => {
    await dbModule.getDB(); // ensure connected
    const collection = dbModule.getCounterCollection();

    assert.ok(collection, 'Counter collection should be returned');
    assert.strictEqual(collection.name, 'counter', 'Collection name should be "counter"');
  });
});

/**
 * UNDERSTANDING TEST OUTPUT:
 * - ✔ = test passed
 * - ✖ = test failed
 * - The duration of each test is shown in milliseconds
 */
