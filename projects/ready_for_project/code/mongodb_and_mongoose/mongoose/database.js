// app.js
const mongoose = require("mongoose");
const Student = require("./models/student");   // <-- using the exported model
const { getConn } = require("./util/db");

async function run() {
  let conn = undefined;
  try {
    // 1. Connect to MongoDB + choose database
  conn = await getConn("nku_demo");

  console.log("Connected with Mongoose!");

    // 2. Insert a student (replaces db.collection("students"))
    await Student.create({
      name: "Jim",
      age: 22,
      major: "ASE",
    });
    console.log("Student inserted!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await conn.close();
  }
}

run().catch(console.error);