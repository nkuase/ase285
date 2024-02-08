/*

Change the package.json to include mongodb as dependencies.
Run `npm install' to install the mongodb module. 

{
  "dependencies": {
    "mongodb": "^6.3.0"
  },
  "scripts": {
    "start": "nodemon ."
  }
}
*/

//MongoDB module import
const { MongoClient } = require('mongodb');
const {URI} = require('./_config.js');
//Built in nodejs module for reading JSON files
const fs = require('fs')
const filePath = 'ase_courses.json';

// Be sure to make database and courses
const databaseName = 'asecourses'
const collectionName = 'courses'

//Connection function and string to specify which MongoDB database is being accessed
async function connect() {
  const client = new MongoClient(URI, {});
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error(error);
  }
}

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
    const result = await collection.updateOne(query, { $set: update });
    console.log(`Updated ${result.modifiedCount} document`);
  } catch (error) {
    console.error(error);
  }
}

//Standard mongoDB function to delete a document matching the specified query
async function delete_document(client, databaseName, collectionName, query) {
  try {
    const collection = client.db(databaseName).collection(collectionName);
    const result = await collection.deleteOne(query);
    console.log(`Deleted ${result.deletedCount} document`);
  } catch (error) {
    console.error(error);
  }
}

// Read the contents of the file
function readJSON(filePath){
  var data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

//Reads JSON information into an array of courses then creates documents for each item
function upload(client, databaseName, collectionName, filepath){
  var documents = readJSON(filepath)
  for (var i = 0; i < documents.courses.length; i++){
    create(client, databaseName, collectionName, documents.courses[i]);
  }
}  

//Asynchronous code block that uses await keywords to run the specified CRUD operations in the right order. 
(async () => {
  const client = await connect();

  await create(client, databaseName, collectionName, {name: "Unix Systems", professor: "Samuel Cho", department: "Computer Science"})
  // await read(client, databaseName, collectionName, {"professor":"Samuel Cho"});
  // await update(client, databaseName, collectionName, {"professor":"Samuel Cho"}, {"professor":"Professor x"});
  // await delete_document(client, databaseName, collectionName, {"professor":"Professor x"});

  //upload(client, databaseName, collectionName, filePath);
  await setTimeout(() => {client.close()}, 1500)
})();

