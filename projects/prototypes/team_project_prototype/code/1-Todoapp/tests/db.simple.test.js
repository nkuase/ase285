// db.simple.test.js - Simple unit tests for beginners
// This is a simplified version to learn testing basics

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
   * EXAMPLE 1: Testing a simple function
   * This shows the basic structure of a test
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
   * EXAMPLE 4: Testing objects
   */
  it('should create user object with correct properties', () => {
    // ARRANGE
    const name = 'Alice';
    const age = 25;
    
    // ACT
    const user = {
      name: name,
      age: age,
      isActive: true
    };
    
    // ASSERT
    assert.strictEqual(user.name, 'Alice', 'Name should be Alice');
    assert.strictEqual(user.age, 25, 'Age should be 25');
    assert.strictEqual(user.isActive, true, 'User should be active');
  });

  /**
   * EXAMPLE 5: Testing error conditions
   */
  it('should throw error when dividing by zero', () => {
    // ARRANGE
    const dividend = 10;
    const divisor = 0;
    
    // ACT & ASSERT: Test that function throws error
    assert.throws(
      () => {
        if (divisor === 0) {
          throw new Error('Cannot divide by zero');
        }
        return dividend / divisor;
      },
      Error,
      'Should throw error for division by zero'
    );
  });
});

/**
 * COMMON ASSERTIONS IN NODE.JS TEST RUNNER:
 * 
 * assert.strictEqual(actual, expected)
 *   - Checks if two values are exactly equal (using ===)
 *   - Example: assert.strictEqual(1 + 1, 2)
 * 
 * assert.ok(value)
 *   - Checks if value is truthy
 *   - Example: assert.ok(user.isLoggedIn)
 * 
 * assert.deepStrictEqual(actual, expected)
 *   - Checks if two objects/arrays are equal (deep comparison)
 *   - Example: assert.deepStrictEqual([1, 2], [1, 2])
 * 
 * assert.throws(fn, error)
 *   - Checks if function throws an error
 *   - Example: assert.throws(() => throwError(), Error)
 * 
 * assert.rejects(promise, error)
 *   - Checks if promise is rejected
 *   - Example: await assert.rejects(fetchData(), NetworkError)
 */

/**
 * RUNNING TESTS:
 * 
 * 1. Run this file:
 *    node --test tests/db.simple.test.js
 * 
 * 2. Run with detailed output:
 *    node --test --test-reporter=spec tests/db.simple.test.js
 * 
 * 3. Watch mode (auto-run when file changes):
 *    node --test --watch tests/db.simple.test.js
 */
