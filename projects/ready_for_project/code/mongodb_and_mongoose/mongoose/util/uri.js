// uri.js (CommonJS version)

const dotenv = require("dotenv");

// Load environment variables
dotenv.config({
  quiet: true,
  path: "../.env",
});

// Validate required variables
const user = process.env.MONGO_USER;
if (!user) throw new Error("MONGO_USER is not defined");

const password = process.env.MONGO_PASSWORD;
if (!password) throw new Error("MONGO_PASSWORD is not defined");

const cluster = process.env.MONGO_CLUSTER;
if (!cluster) throw new Error("MONGO_CLUSTER is not defined");

// Database name
const databasename = process.env.MONGO_DATABASE || "todoapp";

// Construct the MongoDB connection string
const uri = `mongodb+srv://${user}:${password}@cluster0.${cluster}.mongodb.net/`;
// console.log(uri);
// Export (CommonJS style)
module.exports = {
  uri,
  databasename,
};