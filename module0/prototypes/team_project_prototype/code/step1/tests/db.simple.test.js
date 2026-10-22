// db.simple.test.js - Simple unit tests for beginners
// This is a simplified version to learn testing basics (no database is needed)
//
// Run:  node --test tests/db.simple.test.js

import { describe, it } from 'node:test';
import assert from 'node:assert';

/**
 * TESTING BASICS FOR STUDENTS
 *
 * A unit test has three parts:
 * 1. ARRANGE: Set up test data and conditions
 * 2. ACT: Execute the function you want to test
 * 3. ASSERT: Check if the result is what you expected
 *
 * This is called the AAA pattern (Arrange, Act, Assert)
 */

describe('Basic Testing Concepts', () => {
  /**
   * EXAMPLE 1: Testing a simple calculation
   */
  it('should add two numbers correctly', () => {
    // ARRANGE: Set up test data
    const a = 5;
    const b = 3;
    const expected = 8;

    // ACT: Execute the function
    const result = a + b;

    // ASSERT: Check the result
    assert.strictEqual(result, expected, 'Addition should work correctly');
  });

  /**
   * EXAMPLE 2: Testing string operations
   */
  it('should concatenate strings', () => {
    // ARRANGE
    const firstName = 'John';
    const lastName = 'Doe';
    const expected = 'John Doe';

    // ACT
    const fullName = `${firstName} ${lastName}`;

    // ASSERT
    assert.strictEqual(fullName, expected, 'Strings should be joined with space');
  });

  /**
   * EXAMPLE 3: Testing arrays
   */
  it('should find item in array', () => {
    // ARRANGE
    const fruits = ['apple', 'banana', 'orange'];
    const searchItem = 'banana';

    // ACT
    const found = fruits.includes(searchItem);

    // ASSERT
    assert.strictEqual(found, true, 'Should find banana in the array');
  });

  /**
   * EXAMPLE 4: Testing objects (here: the data model of a post)
   */
  it('should create a post object with correct properties', () => {
    // ARRANGE
    const id = 1;
    const title = 'Buy milk';
    const date = '2024-01-01';

    // ACT
    const post = { _id: id, title, date };

    // ASSERT
    assert.deepStrictEqual(post, { _id: 1, title: 'Buy milk', date: '2024-01-01' });
  });

  /**
   * EXAMPLE 5: Testing error conditions
   */
  it('should throw error when the id is not a number', () => {
    // ARRANGE
    const toId = (value) => {
      const id = parseInt(value, 10);
      if (Number.isNaN(id)) throw new Error('Invalid id');
      return id;
    };

    // ACT & ASSERT: the function must throw for a wrong input
    assert.strictEqual(toId('5'), 5);
    assert.throws(() => toId('abc'), /Invalid id/);
  });
});

/**
 * COMMON ASSERTIONS IN THE NODE.JS TEST RUNNER:
 *
 * assert.strictEqual(actual, expected)
 *   - Checks if two values are exactly equal (using ===)
 *
 * assert.ok(value)
 *   - Checks if value is truthy
 *
 * assert.deepStrictEqual(actual, expected)
 *   - Checks if two objects/arrays are equal (deep comparison)
 *
 * assert.throws(fn, error)
 *   - Checks if a function throws an error
 *
 * assert.rejects(promise, error)
 *   - Checks if a promise is rejected
 *     Example: await assert.rejects(fetchData(), NetworkError)
 *
 * RUNNING TESTS:
 *
 * 1. Run this file:                  node --test tests/db.simple.test.js
 * 2. Detailed output:                node --test --test-reporter=spec tests/db.simple.test.js
 * 3. Watch mode (re-run on change):  node --test --watch tests/db.simple.test.js
 */
