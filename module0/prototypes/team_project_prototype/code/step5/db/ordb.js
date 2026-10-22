/**
 * ORDB - Object-Relational Database Abstraction Layer
 *
 * This abstract base class defines the interface that all database adapters must implement.
 * It provides a unified API for database operations regardless of the underlying database.
 *
 * Design patterns: Repository pattern (hides data access) + Adapter pattern (converts APIs)
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
   * @param {Object} filter - Query filter, e.g. { _id: 5 }
   * @param {Object} options - Query options: { sort: { field: 1 | -1 }, limit: number }
   * @returns {Promise<Array>} Array of documents
   */
  async findAll(collection, filter = {}, options = {}) {
    throw new Error('findAll() must be implemented by subclass');
  }

  /**
   * Find a single document
   * @returns {Promise<Object|null>} The document, or null if not found
   */
  async findOne(collection, filter) {
    throw new Error('findOne() must be implemented by subclass');
  }

  /**
   * Insert a new document (the _id is generated when it is not given)
   * @returns {Promise<Object>} The created document, including its _id
   */
  async insertOne(collection, data) {
    throw new Error('insertOne() must be implemented by subclass');
  }

  /**
   * Update a document
   * @param {Object} update - The fields to change, e.g. { title: 'New title' }
   * @returns {Promise<Object|null>} The updated document, or null if not found
   */
  async updateOne(collection, filter, update) {
    throw new Error('updateOne() must be implemented by subclass');
  }

  /**
   * Delete a document
   * @returns {Promise<boolean>} true if deleted, false if not found
   */
  async deleteOne(collection, filter) {
    throw new Error('deleteOne() must be implemented by subclass');
  }

  /**
   * Get the next available numeric ID of a collection
   * @returns {Promise<number>}
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
   * @returns {string} e.g. 'MongoDB' or 'SQLite'
   */
  getType() {
    throw new Error('getType() must be implemented by subclass');
  }
}

export default ORDB;
