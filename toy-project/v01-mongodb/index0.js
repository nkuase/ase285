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

const {MongoClient} = require("mongodb");
const {URI} = require('./_config.js');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI,{});
async function run(client) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run(client)
