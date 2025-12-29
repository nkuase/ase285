/**
 * MongoDB Adapter for ORDB
 * 
 * Implements the ORDB interface for MongoDB database operations.
 * Uses the native MongoDB Node.js driver.
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import { ORDB } from './ordb.js';

export class MongoDBAdapter extends ORDB {
  constructor(uri, databaseName) {
    super();
    this.uri = uri;
    this.databaseName = databaseName;
    this.client = null;
    this.db = null;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      console.log("URI")
      console.log(this.uri)
      this.client = new MongoClient(this.uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('MongoDB disconnected');
    }
  }

  /**
   * Find all documents in a collection
   */
  async findAll(collection, filter = {}, options = {}) {
    const coll = this.db.collection(collection);
    let query = coll.find(filter);
    
    // Apply sort if provided
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    // Apply limit if provided
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query.toArray();
  }

  /**
   * Find one document by filter
   */
  async findOne(collection, filter) {
    return await this.db.collection(collection).findOne(filter);
  }

  /**
   * Insert a new document
   * If data includes _id, use it; otherwise generate next ID
   */
  async insertOne(collection, data) {
    // If _id is not provided, generate next ID
    if (!data._id) {
      data._id = await this.getNextId(collection);
    }
    
    await this.db.collection(collection).insertOne(data);
    return data;
  }

  /**
   * Update one document
   * Returns the updated document
   */
  async updateOne(collection, filter, update) {
    const result = await this.db.collection(collection).findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    );
    
    return result.value;
  }

  /**
   * Delete one document
   * Returns true if deleted, false if not found
   */
  async deleteOne(collection, filter) {
    const result = await this.db.collection(collection).deleteOne(filter);
    return result.deletedCount > 0;
  }

  /**
   * Get next auto-increment ID
   * Finds the highest numeric _id and adds 1
   */
  async getNextId(collection) {
    const coll = this.db.collection(collection);
    const lastDoc = await coll
      .find({ _id: { $type: 'int' } })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    
    return lastDoc.length > 0 ? lastDoc[0]._id + 1 : 1;
  }

  /**
   * Get the database type name
   */
  getType() {
    return 'MongoDB';
  }
}

export default MongoDBAdapter;
