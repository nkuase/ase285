/**
 * MongoDB Adapter for ORDB
 *
 * Implements the ORDB interface with the native MongoDB Node.js driver.
 * The driver already returns Promises, so we only need to `await` its results.
 */

import { MongoClient } from 'mongodb';
import { ORDB } from './ordb.js';

export class MongoDBAdapter extends ORDB {
  constructor(uri, databaseName) {
    super();
    this.uri = uri;
    this.databaseName = databaseName;
    this.client = null;
    this.db = null;
  }

  async connect() {
    // (Never print this.uri: it contains the password.)
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    this.db = this.client.db(this.databaseName);
    console.log('MongoDB connected successfully');
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      console.log('MongoDB disconnected');
    }
  }

  async findAll(collection, filter = {}, options = {}) {
    let query = this.db.collection(collection).find(filter);

    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return await query.toArray();
  }

  async findOne(collection, filter) {
    return await this.db.collection(collection).findOne(filter);
  }

  // If the data has no _id, generate the next one
  async insertOne(collection, data) {
    const doc = { ...data };
    if (doc._id === undefined) {
      doc._id = await this.getNextId(collection);
    }

    await this.db.collection(collection).insertOne(doc);
    return doc;
  }

  // Returns the updated document, or null if nothing matched
  async updateOne(collection, filter, update) {
    if (Object.keys(update).length === 0) {
      return await this.findOne(collection, filter);
    }

    // mongodb driver v6: findOneAndUpdate returns the document itself (or null)
    return await this.db.collection(collection).findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: 'after' }
    );
  }

  // Returns true if a document was deleted
  async deleteOne(collection, filter) {
    const result = await this.db.collection(collection).deleteOne(filter);
    return result.deletedCount > 0;
  }

  // Auto-increment ID: one document per collection in the "counter" collection.
  // The increment is atomic, so two requests never get the same number.
  async getNextId(collection) {
    const result = await this.db.collection('counter').findOneAndUpdate(
      { _id: collection },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    return result.seq;
  }

  getType() {
    return 'MongoDB';
  }
}

export default MongoDBAdapter;
