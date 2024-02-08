// npm install express
// npm install ejs
// npm install -g nodemon
// npm install method-override
// nodemon ./index.js
// Access this server with http://localhost:5500/pet or http://localhost:5500/

const { MongoClient } = require('mongodb');

const uri = require('./db.js');
var db;

const DATABASE = 'todoapp';
const POSTS = 'posts';
const COUNTER = 'counter';

MongoClient.connect(uri, { useUnifiedTopology: true }, function (error, client) {
    if (error) return console.log(error)
    db = client.db(DATABASE);
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(methodOverride('_method'))

app.listen(5500, function () {
    console.log('listening on 5500')
});

app.get('/', function (req, resp) {
    try {
        resp.render('write.ejs')
    } catch (e) {
        console.error(e);
    }
});

app.post('/add', function (req, resp) {
    runAddPost(req, resp);
    resp.redirect('/')
});

async function runAddPost(req, resp) {
    try {
        const counter = db.collection(COUNTER);
        const posts = db.collection(POSTS);

        let query = { name: 'Total Post' };
        let res = await counter.findOne(query);
        console.log(res);
        const totalPost = res.totalPost;

        query = { _id: totalPost + 1, title: req.body.title, date: req.body.date };
        res = await posts.insertOne(query);

        query = { name: 'Total Post' };
        let stage = { $inc: { totalPost: 1 } };
        await counter.updateOne(query, stage);
    } catch (e) {
        console.error(e);
    }
}

app.get('/list', function (req, resp) {
    runListGet(req, resp);
});

async function runListGet(req, resp) {
    try {
        const posts = db.collection(POSTS);
        const res = await posts.find().toArray();
        const query = { posts: res };
        resp.render('list.ejs', query)
    } catch (e) {
        console.error(e);
    }
}

app.get('/listjson', async function (req, resp) {
    try {
        const posts = db.collection(POSTS);
        const res = await posts.find().toArray();
        resp.send(res)
    } catch (e) {
        console.error(e);
    }
});

app.delete('/delete', async function (req, resp) {
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    try {
        const counter = db.collection(COUNTER);
        const posts = db.collection(POSTS)
        const res = await posts.deleteOne(req.body);

        const query = { name: 'Total Post' };
        const stage = { $inc: { totalPost: -1 } };
        await counter.updateOne(query, stage);

        console.log('Delete complete')
        resp.send('Delete complete')
    }
    catch (e) {
        console.error(e);
    }
});

app.get('/detail/:id', async function (req, resp) {
    try {
        let res = await db.collection(POSTS).findOne({ _id: parseInt(req.params.id) })
        // req.params.id contains the value of id
        console.log('app.get.detail: Update complete')
        console.log({ data: res });
        if (res != null) {
            resp.render('detail.ejs', { data: res })
        }
        else {
            console.log(error);
            resp.status(500).send({ error: 'result is null' })
        }
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({ error: 'Error from db.collection().findOne()' })
    }
})

app.get('/edit/:id', async function (req, resp) {
    console.log(req.params)
    try {
        let res = await db.collection(POSTS).findOne({ _id: parseInt(req.params.id) })
        console.log({ data: res })
        if (res != null) {
            resp.render('edit.ejs', { data: res })
        }
        else {
            resp.status(500).send({ error: 'result is null' })
        }
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({ error: 'Error from db.collection().findOne()' })
    }
});

app.put('/edit', async function (req, resp) {
    db.collection(POSTS).updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, function () {
        console.log('app.put.edit: Update complete')
        resp.redirect('/list')
    });
});
