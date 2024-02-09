const {MongoClient} = require("mongodb");

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

async function run(uri, databaseName, command, log) {
  let client;
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client = await connect(uri);
    // Send a ping to confirm a successful connection
    await client.db(databaseName).command(command);
    console.log(log);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// CRUD function 

async function create(uri, databaseName, collectionName, document) {
  let client;
  let result;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    result = await collection.insertOne(document);
    console.log(`Inserted document with ID ${result.insertedId}`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } 
  return result; 
}

async function read(uri, databaseName, collectionName, query) {
  let client;
  let result;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    result = await collection.find(query).toArray();
    console.log(`read: Found ${result.length} documents from ${query} - ${result}`);
    //console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return result;
}

async function update(uri, databaseName, collectionName, query, update) {
  let client;
  let result;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    result = await collection.updateOne(query, update);
    console.log(`update: Updated ${result.modifiedCount} document`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } 
  return result; 
}

async function delete_document(uri, databaseName, collectionName, query) {
  let client;
  let result;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    result = await collection.deleteOne(query);
    console.log(`Deleted ${result.deletedCount} document`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return result;
}

module.exports.connect = connect;
module.exports.run = run;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.delete_document = delete_document;
