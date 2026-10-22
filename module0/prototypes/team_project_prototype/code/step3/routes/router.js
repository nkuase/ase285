import express from 'express';
import { POSTS } from '../util/db.js';
import { runAddPost, runListGet } from '../util/util.js';

// Factory function: the database is injected instead of imported (Dependency Injection).
// Web UI routes return HTML pages (EJS templates) or redirects.
export function createRouter(db) {
  const router = express.Router();
  const posts = db.collection(POSTS);

  // The id arrives as a string ("5"): convert it to a number (NaN means "not a number").
  const toId = (value) => parseInt(value, 10);

  // Create
  router.post('/add', async (req, res) => {
    try {
      await runAddPost(db, req);
      res.redirect('/');
    } catch (e) {
      console.error(e);
      res.status(500).send('Error: failed to add the post');
    }
  });

  // Read
  router.get('/', (req, res) => {
    res.render('write.ejs');
  });

  router.get('/list', async (req, res) => {
    try {
      await runListGet(db, res);
    } catch (e) {
      console.error(e);
      res.status(500).send('Error: failed to load the posts');
    }
  });

  router.get('/detail/:id', async (req, res) => {
    try {
      const id = toId(req.params.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      const data = await posts.findOne({ _id: id });
      if (!data) return res.status(404).send('Post not found');

      res.render('detail.ejs', { data });
    } catch (e) {
      console.error(e);
      res.status(500).send('Error from posts.findOne()');
    }
  });

  // Update
  router.get('/edit/:id', async (req, res) => {
    try {
      const id = toId(req.params.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      const data = await posts.findOne({ _id: id });
      if (!data) return res.status(404).send('Post not found');

      res.render('edit.ejs', { data });
    } catch (e) {
      console.error(e);
      res.status(500).send('Error from posts.findOne()');
    }
  });

  router.put('/edit', async (req, res) => {
    try {
      const id = toId(req.body.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      await posts.updateOne(
        { _id: id },
        { $set: { title: req.body.title, date: req.body.date } }
      );
      res.redirect('/list');
    } catch (e) {
      console.error(e);
      res.status(500).send('Error: failed to update the post');
    }
  });

  // Delete
  router.delete('/delete', async (req, res) => {
    try {
      const id = toId(req.body._id); // the body._id is a string, so change it into a number
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      await posts.deleteOne({ _id: id });
      res.send('Delete complete');
    } catch (e) {
      console.error(e);
      res.status(500).send('Error: failed to delete the post');
    }
  });

  return router;
}
