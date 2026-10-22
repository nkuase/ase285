const { getDB } = require('./util/db');

const DATABASE = 'todoapp';
const COLLECTION = 'posts';

let db;

async function initialize() {
  db = await getDB(DATABASE);
}

initialize();

// Install express
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// callback functions

app.listen(5500, function () {
  console.log('listening on 5500');
});

app.get('/', function (req, resp) {
  resp.sendFile(__dirname + '/write.html');
});

app.post('/add', async function (req, resp) {
  try {
    const posts = db.collection(COLLECTION);
    const query = { title: req.body.title, date: req.body.date };
    await posts.insertOne(query);
    resp.send('Stored to MongoDB OK');
  } catch (e) {
    console.error(e);
    resp.status(500).send('Error: could not store the data');
  }
});
