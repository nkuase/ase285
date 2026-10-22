// routes/api.js
import express from 'express';
import { POSTS } from '../util/db.js';
import { getNextId } from '../util/util.js';

// REST API routes (mounted at /api in index.js).
// - JSON in / JSON out, proper HTTP methods and status codes
// - The database is injected through the factory function
export function createApiRouter(db) {
  const router = express.Router();
  const posts = db.collection(POSTS);

  // GET /api/posts - all posts
  router.get('/posts', async (req, res) => {
    try {
      const docs = await posts.find().sort({ _id: 1 }).toArray();
      res.json(docs);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // GET /api/posts/:id - one post
  router.get('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const doc = await posts.findOne({ _id: id });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // POST /api/posts - create a post (auto-increment numeric _id)
  router.post('/posts', async (req, res) => {
    try {
      const { title, date } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required' });

      // The same counter as the web UI uses: ids never collide
      const doc = { _id: await getNextId(db), title, date: date || '' };
      await posts.insertOne(doc);
      res.status(201).json(doc); // 201 Created
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // PUT /api/posts/:id - update a post (only the given fields)
  router.put('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const { title, date } = req.body || {};
      const update = {};
      if (title !== undefined) update.title = title;
      if (date !== undefined) update.date = date;

      if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      // mongodb driver v6: findOneAndUpdate returns the document itself (or null)
      const updated = await posts.findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  // DELETE /api/posts/:id - delete a post
  router.delete('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const result = await posts.deleteOne({ _id: id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true, deletedId: id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
}
