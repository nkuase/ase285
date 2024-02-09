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

function readJSON(filePath){
  var data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function uploadJSON(client, databaseName, collectionName, filepath){
  var documents = readJSON(filepath)
  //console.log("Documents: " + JSON.stringify(documents.courses[0]))
  for (var i = 0; i < documents.courses.length; i++){
    create(client, databaseName, collectionName, documents.courses[i]);
  }
}

async function removeAllDocuments(uri, databaseName, collectionName) {
  let client;
    try {
        // Connect the client to the server
        client = await connect(uri);      
        // Select the database
        const db = client.db(databaseName);
        // Get the collection
        const collection = db.collection(collectionName);
        // Delete all documents in the collection
        const result = await collection.deleteMany({});

        console.log(`${result.deletedCount} documents were removed from the collection ${collectionName}`);
    } catch (error) {
        console.error('Error removing documents:', error);
    } finally {
        // Close the connection
        await client.close();
    }
}


module.exports.connect = connect;
module.exports.run = run;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.delete_document = delete_document;
module.exports.readJSON = readJSON;
module.exports.uploadJSON = uploadJSON;
module.exports.removeAllDocuments = removeAllDocuments;
