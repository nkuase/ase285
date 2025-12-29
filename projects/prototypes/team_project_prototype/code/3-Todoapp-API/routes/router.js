import express from "express";
import { getPostsCollection, getCounterCollection } from '../util/db.js';
import { runAddPost } from "../util/util.js";

export function createRouter(db) {
  const router = express.Router();
  const posts = getPostsCollection();
  const counter = getCounterCollection();

  router.get('/', function (_, resp) {
    try {
      resp.render('write.ejs')
    } catch (e) {
      console.error(e);
    }
  });

  router.post('/add', async function (req, resp) {
    try {
      await runAddPost(req);
      resp.redirect('/');          // single response
    } catch (e) {
      console.error(e);
      resp.status(500).send('Error');
    }
  });

  router.get('/list', function (req, resp) {
    runListGet(req, resp);
  });

  router.delete('/delete', async function (req, resp) {
    req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
    console.log(req.body._id);
    try {
      await posts.deleteOne(req.body);

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

  router.get('/detail/:id', async function (req, resp) {
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

  router.get('/edit/:id', async function (req, resp) {
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

  router.put('/edit', async function (req, resp) {
    posts.updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, function () {
      console.log('app.put.edit: Update complete')
      resp.redirect('/list')
    });
  });


  return router;
}
