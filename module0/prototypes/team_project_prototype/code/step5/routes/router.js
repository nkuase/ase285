/**
 * Web UI routes (EJS templates) using the ORDB interface.
 * There is no database-specific code here: it works with MongoDB and SQLite.
 */

import express from 'express';

export function createRouter(db) {
  const router = express.Router();
  const COLLECTION = 'posts';

  // The id arrives as a string ("5"): convert it to a number (NaN means "not a number").
  const toId = (value) => parseInt(value, 10);

  // Create
  router.post('/add', async (req, res) => {
    try {
      const { title, date } = req.body;

      await db.insertOne(COLLECTION, { title: title || '', date: date || '' });
      res.redirect('/');
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).send('Failed to add post');
    }
  });

  // Read
  router.get('/', (req, res) => {
    res.render('write.ejs');
  });

  router.get('/list', async (req, res) => {
    try {
      const posts = await db.findAll(COLLECTION, {}, { sort: { _id: 1 } });
      res.render('list.ejs', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Failed to fetch posts');
    }
  });

  router.get('/detail/:id', async (req, res) => {
    try {
      const id = toId(req.params.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      const data = await db.findOne(COLLECTION, { _id: id });
      if (!data) return res.status(404).send('Post not found');

      res.render('detail.ejs', { data });
    } catch (error) {
      console.error('Error fetching detail:', error);
      res.status(500).send('Error fetching post detail');
    }
  });

  // Update
  router.get('/edit/:id', async (req, res) => {
    try {
      const id = toId(req.params.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      const data = await db.findOne(COLLECTION, { _id: id });
      if (!data) return res.status(404).send('Post not found');

      res.render('edit.ejs', { data });
    } catch (error) {
      console.error('Error fetching edit form:', error);
      res.status(500).send('Error fetching post for editing');
    }
  });

  router.put('/edit', async (req, res) => {
    try {
      const id = toId(req.body.id);
      if (Number.isNaN(id)) return res.status(400).send('Invalid id');

      const updated = await db.updateOne(
        COLLECTION,
        { _id: id },
        { title: req.body.title, date: req.body.date }
      );
      if (!updated) return res.status(404).send('Post not found');

      res.redirect('/list');
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).send('Failed to update post');
    }
  });

  // Delete (the AJAX request from list.ejs)
  router.delete('/delete', async (req, res) => {
    try {
      const id = toId(req.body._id);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const deleted = await db.deleteOne(COLLECTION, { _id: id });
      if (!deleted) return res.status(404).json({ error: 'Post not found' });

      res.json({ ok: true, deletedId: id });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
}

export default { createRouter };
