---
marp: true
html: true
size: 4:3
paginate: true
style: |
  h2 {
    /* text-shadow: 1px 1px 0px #000000;*/
    color: #333;
    background-color: #e1bee7;  /* Yellow background to highlight */
    padding: 0.2em 0.4em;       /* Optional padding for better appearance */
    border-radius: 0.2em;       /* Optional rounded corners */
  }
  h3 {
    text-shadow: 1px 1px 0px #000000;
    color: #333;
  }  
  strong {
    text-shadow: 1px 1px 0px #000000;
  }
  @media print {
    strong {
      text-shadow: none !important;
      -webkit-text-stroke: 0.6px rgba(0,0,0,0.35);
      text-stroke: 0.6px rgba(0,0,0,0.35); /* ignored by many, harmless */
    }
  }
  img[alt~="center"] {
    display: block;
    margin: 0 auto;
  }
    img[alt~="outline"] {
    border: 2px solid #388bee;
  }
  .columns {
    display: flex;
    gap: 2rem;
  }
  .column {
    flex: 1;
  }
---

<!-- _class: lead -->
<!-- _class: frontpage -->
<!-- _paginate: skip -->

# MongoDB and Node.js

Accessing MongoDB using Node.js

---

## MongoDB Structure

Project - Many clusters
Cluster - A set of a data base
Database - A set of collections (directories)
Collection - A table (a directory with files)
Document - A row in a table (a file)

---

### MongoDB Cluster Structure

A MongoDB cluster is a group of MongoDB servers working together as a single system.

- You access it with a connection string like:

```txt
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net
```

A MongoDB Cluster provides reliability, safety, scalability, and performance that a single machine cannot deliver.

---

### MongoDB Database

One Database has multiple collections that have multiple documents.

<style>
.columns {
  display: flex;
  align-items: center;
}
.column.text {
  flex: 5;
}
.column.image {
  flex: 5;
}
</style>

<div class="columns">
  <div class="column image">

![w:300pt center](./pic/mongodb/MongoDB-database-colection.png)

  </div>

  <div class="column text">

![w:260pt center](./pic/mongodb/relationship.png)

  </div>
</div>

- One RDBMS table is equivalent to Collection (directory).
- A row in a table is to Document (one file).

---

## Using MongoDB Atlas

The simplest way to use MongoDB is to use Atlas and Compass.

1. Register MongoDB Atlas: <https://www.mongodb.com/products/platform>

2. Use Compass to access MongoDB from standalone Desktop app: <https://www.mongodb.com/products/tools/compass>

---

### Create Project

![w:300pt center](./pic/mongodb/project1.png)
![w:300pt center](./pic/mongodb/project2.png)

Let's say we make `TodoApp` project.

---

### Create Cluster

In the project, we can create cluster; choose free version.

![w:200pt center](./pic/mongodb/cluster1.png)
![w:300pt center](./pic/mongodb/cluster2.png)

---

Create user/password for the cluster: chos5/1234hello (example)

![w:300pt center](./pic/mongodb/cluster3.png)

Edit to allow the access from anywhere for easy development.

![w:300pt center](./pic/mongodb/cluster4.png)

---

### Connect to Cluster0

We assume that we use only cluster0 in the project; if you use other cluster name, adjust accordingly.

![w:200pt center](./pic/mongodb/cluster5.png)
![w:200pt center](./pic/mongodb/cluster6.png)

---

Choose `Node.js` to get the information to access the MongoDB.

![w:300pt center](./pic/mongodb/cluster7.png)

---

For `chos5/1234hello`, we can access the mongoDB Cluster (`spkinwx`) as:

```js
mongodb+srv://chos5:1234hello@cluster0.spkinwx.mongodb.net/
```

The `appName` parameter in a MongoDB connection string is optional and is used to uniquely identify the application connecting to the database; It can be useful for monitoring, logging, and debugging purposes on the server side, as it allows MongoDB to see which application is making requests.

```js
mongodb+srv://chos5:1234hello@cluster0.spkinwx.mongodb.net/appName=Cluster0
```

---

## .env

We store `user/password` information in the `.env` file.

```txt
MONGO_USER=YOUR_USER
MONGO_PASSWORD=YOUR_PASSWORD                                          
MONGO_CLUSTER=YOUR_CLUSTER
```

Use the env template:

1. Copy `env` to `.env` and replace your user/password/cluster with yours.
2. Be sure that `.gitignore` contains `.env` so it is not uploaded to GitHub.

You can add more information such as:

```txt
MONGO_DATABASE=YOUR_DATABASE                                               
```

---

We use `dotenv` package to access the variables in the `.env` file.

```js
require('dotenv').config({ quiet: true });
```

If the .env is not in the root directory (of your project), we need to specify the locaiton.

```js
require('dotenv').config({ path: './path/to/your/.env' });
```

---

### `uri.js` Utility module

We use `uri.js` to access the environment variables and create the uri string for MongoDB access.

```js
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({quiet: true, path: "../.env",});

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

// Export (CommonJS style)
module.exports = {uri, databasename,};
```

---

### CommonJS Module Style

In this example, we use CommonJS module style:

1. It uses `require` for module import.

```js
const dotenv = require("dotenv");
```

2. It uses `modules.exports` for module export.

```js
module.exports = {
  uri,
  databasename,
};
```

---

## MongoClient object client

With the `uri`, we can create the MongoDB client object to access the MongoDB database.

```js
const { MongoClient } = require('mongodb');
const uri = require('./uri.js')
const client = new MongoClient(uri);
```

---

To ensures your application only uses commands and behaviors defined in the specified stable API version, we may use `ServerApiVersion`.

```js
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = require('./uri.js')
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
```

---

### Connection Layer and Database

This is native driver mental model with the official mongodb driver:

```js
import { MongoClient } from "mongodb";

const client = new MongoClient(uri); // connection pool (not yet connected)

let db = null;

export async function connect(databaseName = DATABASE) {
  if (db) return db;           // already connected & using this DB

  await client.connect();      // open TCP connections, auth, etc.
  db = client.db(databaseName) // lightweight DB handle on that connection
  return db;
}
```

---

In this model:

- client = connection pool object (one per app is typical)
- db = logical database (a thin wrapper over client)

```txt
client  ---- sockets, pool, auth
   |
   +-- db("todoapp")
   +-- db("logs")
```

To close DB connection, we use client:

```js
client.close()
```

---

### `db.js` Utility function

We export client object and getDB function

```js
// db.js
// Create a single MongoClient instance
const client = new MongoClient(uri); // connection

// Create and reuse a single database connection
async function getDB(database = DATABASE) {
  if (db) return db;          // reuse existing connection

  await client.connect();     // connect once
  db = client.db(database);   // store db globally
  return db;
}

module.exports = {
  client,
  getDB,
  ...
};  
```

---

#### Singleton Design Pattern

> In the code, we reuse `db` if it is assigned a Database: `if (db) return db;`.
> In this way, we use only one Database object.
> We call this design pattern "Singleton Design Pattern."

---

#### Collections

We need to make collections, so in the `db.js` module, we make utility functions to return the collections.

```js
const POSTS = 'posts';
const COUNTER = 'counter';
```

```js
// Return the "posts" collection
export function getPostsCollection() {
  return db.collection(POSTS);
}

// Return the "counter" collection
export function getCounterCollection() {
  return db.collection(COUNTER);
}
```

---

### Example1: ping.js

We can use the ping command to check if we can access the MongoDB.

```js
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
```

---

We use the `db.js` client object:

```js
const db = require('./util/db.js')
let client;
client = await db.client;
```

In the CommonJS, we cannot use top-level async/await, so we should put the async/await code in a function and run it.

```js
async function run() {
  try { ... }
  finally { await client.close(); }
}
run().catch(console.dir);
```

---

### Example 2: database.db: Create DB & Collection

MongoDB will:

- Create database nku_demo
- Create collection students
- Insert one document (thus materializing both)

```js
// 1. Create (or use) a database
const db = await getDB("nku_demo"); // reates only when data is added
console.log("Connected!");
// 2 Create (or use) a collection
const students = db.collection("students");
// 3. Optionally, define indexes or insert ata
await students.insertOne({ name: "Alice", age: 22, major: "ASE" });
```

---

#### Optional: Explicitly create collection

If you want to explicitly create a collection (e.g., with schema validation, capped size, etc.) before inserting, use:

```js
await db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age"],
      properties: {
        name: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
});
console.log("Collection 'students' created with schema!");
```

---

#### The Need for Mongoose

> For MongoDB, schema is an option, and it may sometimes cause an issue.
>
> Mogoose is the solution to enforce schema or Data model to resolve this issue.
>
> We will discuss the idea of Mongoose in the next section.

---

## Compass as the Desktop MongoDB Tool

We use the the uri information to use Compass (and many applications).

```txt
(Example, use your uri)
mongodb+srv://chos5:1234hello@cluster0.spkinwx.mongodb.net/
```

![w:150pt center](./pic/mongodb/compass1.png)
![w:150pt center](./pic/mongodb/compass2.png)

---

### Verify your database & collection

You check the results:

![w:400pt center](./pic/mongodb/database_access.png)

To update the screen, use "Open in new tab" function

![w:100pt center](./pic/mongodb/open_in_new_tab.png)

---

You can also check it from the MongoDB shell in the Compass:

```bash
show dbs
use nku_demo
show collections
db.students.find()
```

![w:200pt center](./pic/mongodb/shell.png)

---

## Undersatnding MongoDB

### Lazy Creation

In MongoDB, databases and collections are created lazily — they don’t exist until you actually insert data into them: So, when you run something like:

```js
const db = client.db("mydb");
const coll = db.collection("users");
await coll.insertOne({ name: "Alice" });
```

MongoDB automatically creates both mydb and users if they don’t already exist.

---

### The _id  field

Every MongoDB document has a special field _id that uniquely identifies it: By default, MongoDB creates it as an ObjectId — a 12-byte binary value (not a string).

Example when you insert a document:

```js
{
  _id: ObjectId("672746cbe3e9d79cfafca932"),
  title: "Hello",
  date: "2025-11-03"
}
```

---

#### convert string → ObjectId

##### When data comes from HTTP (forms, JSON, etc.)

In Express, everything you receive from a request — body, params, query — is a string.

Example:

```bash
console.log(req.body._id)  // "672746cbe3e9d79cfafca932"  ← string, not ObjectId
```

MongoDB cannot match a string against a stored ObjectId:

```js
await db.collection('posts').deleteOne({ _id: "672746cbe3e9d79cfafca932" })
// ❌ No document will be deleted, because the types don't match
```

---

##### Solution: ObjectId

That’s why we do:

```js
const { ObjectId } = require('mongodb');
await db.collection('posts').deleteOne({ _id: new ObjectId(_id) });
```

Now the query compares ObjectId to ObjectId, and MongoDB finds the right document.

---

##### When you don’t need it

You only need ObjectId() if your _id values are ObjectIds (MongoDB’s default).

If you define _id as a plain number or string when inserting, then no conversion is needed:

```js
await posts.insertOne({ _id: 1, title: 'A' });
await posts.deleteOne({ _id: 1 });  // works fine
```
