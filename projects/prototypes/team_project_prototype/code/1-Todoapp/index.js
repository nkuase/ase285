import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import { getDB, getPostsCollection, getCounterCollection } from './util/db.js';
import { runListGet, runAddPost } from './util/util.js'

const db = await getDB();
const posts = getPostsCollection();
const counter = getCounterCollection();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static('public'));
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');

app.listen(5500, function () {
  console.log('listening on 5500')
});

app.get('/', function (_, resp) {
  try {
    resp.render('write.ejs')
  } catch (e) {
    console.error(e);
  }
});

app.post('/add', async function (req, resp) {
  try {
    await runAddPost(req, resp);
    resp.redirect('/');          // single response
  } catch (e) {
    console.error(e);
    resp.status(500).send('Error');
  }
});

app.get('/list', function (req, resp) {
  runListGet(req, resp);
});

app.delete('/delete', async function(req, resp){
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    try {
        const posts = db.collection(POSTS)
        const res = await posts.deleteOne(req.body); 

        console.log('Delete complete')
        resp.send('Delete complete')
    }
    catch (e) {
        console.error(e);
    } 
});

app.get('/detail/:id', async function (req, resp) {
  try {
    let res = await posts.findOne({ _id: parseInt(req.params.id) })
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
    let res = await posts.findOne({ _id: parseInt(req.params.id) })
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
  try {
    await posts.updateOne(
      { _id: parseInt(req.body.id) },
      { $set: { title: req.body.title, date: req.body.date } }
    );

    console.log('app.put.edit: Update complete');
    resp.redirect('/list');    // ✅ Correct
  } catch (e) {
    console.error(e);
    resp.status(500).send('Update error');
  }
});


// API for JSON

app.get('/listjson', async function (req, resp) {
  try {
    const res = await posts.find().toArray();
    resp.send(res)
  } catch (e) {
    console.error(e);
  }
});
