const { client, getDB } = require('./util/db.js')

async function run() {
  try {
    // 1. Create (or use) a database
    const db = await getDB("nku_demo"); // creates only when data is added
    console.log("Connected!");

    // 2 Create (or use) a collection
    const students = db.collection("students");

    // 3. Optionally, define indexes or insert data
    await students.insertOne({ name: "Alice", age: 22, major: "ASE" });

    console.log("Database and collection ready!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);