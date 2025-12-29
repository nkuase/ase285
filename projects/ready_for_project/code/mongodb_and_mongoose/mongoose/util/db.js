const mongoose = require('mongoose');
const { uri, databasename } = require("./uri.js"); // both are properties of module.exports


const DATABASE = databasename;
const POSTS = "posts";
const COUNTER = "counter";

let conn = null;

// Create and reuse a single Mongoose connection
async function getConn(database = "todoapp") {
  if (conn) return conn;   // reuse existing connection

  try {
    await mongoose.connect(uri, {
      dbName: database,
    });

    conn = mongoose.connection;  // store global connection
    return conn;
  } catch (err) {
    console.error("Mongoose connection error:", err);
    throw err;
  }
}

module.exports = { getConn };
