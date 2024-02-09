const {MongoClient} = require("mongodb");
const fs = require('fs')

async function connect(uri) {
  const client = new MongoClient(uri, {});
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error(error);
  }
}
// CRUD function

//takes JSON data to add document to mongoDB database
async function create(client, databaseName, collectionName, document) {
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.insertOne(document);
    console.log(`Inserted document with ID ${result.insertedId}`);
  } catch (error) {
    console.error(error);
  }
}

// Function that takes uses a query to find a document in the database
async function read(client, databaseName, collectionName, query) {
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.find(query).toArray();
    console.log(`Found ${result.length} documents`);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

//Standard mongoDB update operation. Updates single document that matches the query
async function update(client, databaseName, collectionName, query, update) {
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.updateOne(query, update);
    console.log(`Updated ${result.modifiedCount} document`);
  } catch (error) {
    console.error(error);
  }
}

// Utility
function readJSON(filepath){
  var data = fs.readFileSync(filepath, "utf8");
  return JSON.parse(data);
}

async function uploadJSON(uri, databaseName, collectionName, filepath){
  let documents = readJSON(filepath)
  let client;
  try {
    client = await connect(uri);
    for (var i = 0; i < documents.courses.length; i++){
      await create(client, databaseName, collectionName, documents.courses[i]);
    }
  } catch (error) {
    console.error('Error uploading documents:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}

module.exports.connect = connect;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.readJSON = readJSON;
module.exports.uploadJSON = uploadJSON;
