const { getConn } = require("./util/db.js");

async function run() {
  let conn = null;
  try {
    // 1. Connect using Mongoose (no client creation)
    conn = await getConn('todoapp');
    // 2. Ping the database through Mongoose's connection
    await conn.db.command({ ping: 1 }); // we use db.command

    console.log("Pinged your deployment. Connected to MongoDB with Mongoose!");
  } catch (err) {
    console.error(err);
  } finally {
    // 3. Close Mongoose connection
    await conn.close();
  }
}

run().catch(console.error);