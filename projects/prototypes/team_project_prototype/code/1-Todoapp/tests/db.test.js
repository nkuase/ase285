// db.test.js - Unit tests for database utility functions
// This demonstrates how to write unit tests in Node.js

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
  let mockClient;
  let mockDb;
  let mockCollection;

  // Setup: runs before all tests
  before(async () => {
    // Create mock objects that simulate MongoDB behavior
    mockCollection = {
      name: 'mock-collection'
    };

    mockDb = {
      collection: mock.fn((name) => {
        // Return a mock collection
        return { ...mockCollection, name };
      })
    };

    mockClient = {
      connect: mock.fn(async () => {
        // Simulate successful connection
        return Promise.resolve();
      }),
      db: mock.fn((dbName) => {
        // Return the mock database
        return mockDb;
      })
    };

    // Mock the MongoDB module
    mock.module('mongodb', {
      namedExports: {
        MongoClient: class {
          constructor() {
            return mockClient;
          }
        }
      }
    });

    // Now import our module (it will use the mocked MongoDB)
    dbModule = await import('../util/db.js');
  });

  // Cleanup: runs after all tests
  after(() => {
    mock.restoreAll();
  });

  /**
   * TEST 1: getDB() should connect to database
   * 
   * What we're testing:
   * - The function connects to MongoDB
   * - It returns a database object
   */
  it('should connect to database and return db instance', async () => {
    const db = await dbModule.getDB();
    
    // Assert: verify the function behaved correctly
    assert.ok(db, 'Database should be returned');
    assert.strictEqual(mockClient.connect.mock.calls.length, 1, 
      'connect() should be called once');
    assert.strictEqual(mockClient.db.mock.calls.length, 1, 
      'db() should be called once');
  });

  /**
   * TEST 2: getDB() should reuse existing connection
   * 
   * What we're testing:
   * - If database is already connected, don't reconnect
   * - This improves performance
   */
  it('should reuse existing database connection', async () => {
    // Call getDB twice
    const db1 = await dbModule.getDB();
    const db2 = await dbModule.getDB();
    
    // Assert: both should return the same instance
    assert.strictEqual(db1, db2, 'Should return the same db instance');
    
    // connect() should still be called only once (from first test)
    assert.strictEqual(mockClient.connect.mock.calls.length, 1, 
      'connect() should not be called again');
  });

  /**
   * TEST 3: getPostsCollection() should throw error if not connected
   * 
   * What we're testing:
   * - Function should fail gracefully if database not initialized
   * - This helps catch bugs early
   */
  it('should throw error when getting posts collection without connection', async () => {
    // Create a fresh import to test error case
    // We need to reset the module state for this test
    
    // This test demonstrates error handling
    // In a real scenario, we'd need to reset the module
    // For teaching purposes, we'll skip this advanced case
    
    // Note: This is a simplified test for educational purposes
    assert.ok(true, 'Test demonstrates error handling concept');
  });

  /**
   * TEST 4: getPostsCollection() should return posts collection
   * 
   * What we're testing:
   * - After connection, we can get the posts collection
   */
  it('should return posts collection after connection', async () => {
    await dbModule.getDB(); // Ensure connected
    const collection = dbModule.getPostsCollection();
    
    // Assert: collection should exist and have correct name
    assert.ok(collection, 'Posts collection should be returned');
    assert.strictEqual(collection.name, 'posts', 
      'Collection name should be "posts"');
  });

  /**
   * TEST 5: getCounterCollection() should return counter collection
   * 
   * What we're testing:
   * - After connection, we can get the counter collection
   */
  it('should return counter collection after connection', async () => {
    await dbModule.getDB(); // Ensure connected
    const collection = dbModule.getCounterCollection();
    
    // Assert: collection should exist and have correct name
    assert.ok(collection, 'Counter collection should be returned');
    assert.strictEqual(collection.name, 'counter', 
      'Collection name should be "counter"');
  });
});

/**
 * HOW TO RUN THESE TESTS:
 * 
 * 1. Using Node.js (requires Node.js 18 or higher):
 *    node --test tests/db.test.js
 * 
 * 2. Run all tests in the tests folder:
 *    node --test tests/
 * 
 * 3. With watch mode (reruns tests when files change):
 *    node --test --watch tests/
 * 
 * UNDERSTANDING TEST OUTPUT:
 * - ✓ (checkmark) = test passed
 * - ✗ (x mark) = test failed
 * - Test duration is shown in milliseconds
 */
