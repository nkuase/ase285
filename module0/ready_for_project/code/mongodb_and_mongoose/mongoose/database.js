// database.js
const Student = require("./models/student");   // <-- using the exported model
const { getConn } = require("./util/db");

async function run() {
  let conn = null;
  try {
    // 1. Connect to MongoDB + choose the database
    conn = await getConn("nku_demo");

    console.log("Connected with Mongoose!");

    // 2. Insert a student (replaces db.collection("students").insertOne(...))
    await Student.create({
      name: "Jim",
      age: 22,
      major: "ASE",
    });
    console.log("Student inserted!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // conn is null if the connection failed
    if (conn) await conn.close();
  }
}

run().catch(console.error);
