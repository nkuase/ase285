const {client, getDB} = require('./util/db.js')

async function run() {
  try {
      const db = await getDB("admin"); // get DB
    await db.command({ ping: 1 }); // ping
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
