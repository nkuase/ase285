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

async function create(uri, databaseName, collectionName, document) {
  let client;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.insertOne(document);
    console.log(`Inserted document with ID ${result.insertedId}`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }  
}

async function read(uri, databaseName, collectionName, query) {
  let client;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.find(query).toArray();
    console.log(`Found ${result.length} documents`);
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }  
}

async function update(uri, databaseName, collectionName, query, update) {
  let client;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.updateOne(query, { $set: update });
    console.log(`Updated ${result.modifiedCount} document`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }  
}

async function delete_document(uri, databaseName, collectionName, query) {
  let client;
  try {
    client = await connect(uri);
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.deleteOne(query);
    console.log(`Deleted ${result.deletedCount} document`);
  } catch (error) {
    console.error(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
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

module.exports.connect = connect;
module.exports.run = run;
module.exports.create = create;
module.exports.read = read;
module.exports.update = update;
module.exports.delete_document = delete_document;
module.exports.readJSON = readJSON;
module.exports.uploadJSON = uploadJSON;
