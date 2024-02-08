// npm install -g nodemon
// inpm install . 
// npm start

const {MongoClient} = require("mongodb");

const uri = require('./db.js');
const DATABASE = 'todoapp'; 
const COLLECTION = 'posts'

const client = new MongoClient(uri);
async function run() {
  try {
    // Be sure there is no {name : 'John', age : 10} in the database.
    await client.connect();
    const database = client.db(DATABASE);
    const posts = database.collection(COLLECTION);
    const query = {name : 'John', age : 10} ;
    await posts.insertOne(query);
  } catch (e) {
    console.error(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

/*
MongoClient.connect(uri).then(
  client => runApp(client)
)
function runApp(client) {
  client.db(DATABASE).collection(COLLECTION).insertOne(query).then(
    results => console.log(results)
  );
}
*/