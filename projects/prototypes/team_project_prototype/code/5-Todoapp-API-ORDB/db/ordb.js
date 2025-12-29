/**
 * ORDB - Object-Relational Database Abstraction Layer
 * 
 * This abstract base class defines the interface that all database adapters must implement.
 * It provides a unified API for database operations regardless of the underlying database system.
 * 
 * Design Pattern: Repository Pattern / Abstract Factory Pattern
 */

export class ORDB {
  /**
   * Initialize the database connection
   * @returns {Promise<void>}
   */
  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  /**
   * Find all documents in a collection
   * @param {string} collection - Collection/table name
   * @param {Object} filter - Query filter
   * @param {Object} options - Query options (sort, limit, etc.)
   * @returns {Promise<Array>} Array of documents
   */
  async findAll(collection, filter = {}, options = {}) {
    throw new Error('findAll() must be implemented by subclass');
  }

  /**
   * Find a single document
   * @param {string} collection - Collection/table name
   * @param {Object} filter - Query filter
   * @returns {Promise<Object|null>} The document or null if not found
   */
  async findOne(collection, filter) {
    throw new Error('findOne() must be implemented by subclass');
  }

  /**
   * Insert a new document
   * @param {string} collection - Collection/table name
   * @param {Object} data - Document data
   * @returns {Promise<Object>} The created document with _id
   */
  async insertOne(collection, data) {
    throw new Error('insertOne() must be implemented by subclass');
  }

  /**
   * Update a document
   * @param {string} collection - Collection/table name
   * @param {Object} filter - Query filter
   * @param {Object} update - Update data
   * @returns {Promise<Object|null>} The updated document or null if not found
   */
  async updateOne(collection, filter, update) {
    throw new Error('updateOne() must be implemented by subclass');
  }

  /**
   * Delete a document
   * @param {string} collection - Collection/table name
   * @param {Object} filter - Query filter
   * @returns {Promise<boolean>} true if deleted, false if not found
   */
  async deleteOne(collection, filter) {
    throw new Error('deleteOne() must be implemented by subclass');
  }

  /**
   * Get the next available ID for a collection
   * @param {string} collection - Collection/table name
   * @returns {Promise<number>} The next ID
   */
  async getNextId(collection) {
    throw new Error('getNextId() must be implemented by subclass');
  }

  /**
   * Close the database connection
   * @returns {Promise<void>}
   */
  async disconnect() {
    throw new Error('disconnect() must be implemented by subclass');
  }

  /**
   * Get the database type name
   * @returns {string} The database type (e.g., 'MongoDB', 'SQLite')
   */
  getType() {
    throw new Error('getType() must be implemented by subclass');
  }
}

export default ORDB;
