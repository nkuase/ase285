// routes/api.js
import express from 'express'

export function createApiRouter(db) {
  const router = express.Router();
  const POSTS = 'posts';

  // GET /api/posts
  router.get('/posts', async (req, res) => {
    try {
      const posts = await db.collection(POSTS).find().sort({ _id: 1 }).toArray();
      res.json(posts);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // GET /api/posts/:id
  router.get('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const doc = await db.collection(POSTS).findOne({ _id: id });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      res.json(doc);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  // POST /api/posts  (auto-increment numeric _id)
  router.post('/posts', async (req, res) => {
    try {
      const { title, date } = req.body || {};
      if (!title) return res.status(400).json({ error: 'title is required' });

      const posts = db.collection(POSTS);
      const last = await posts
        .find({ _id: { $type: 'int' } })
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      const newId = last.length ? (last[0]._id + 1) : 1;

      const doc = { _id: newId, title, date };
      await posts.insertOne(doc);
      res.status(201).json(doc);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // PUT /api/posts/:id
  router.put('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const { title, date } = req.body || {};
      const update = {};
      if (title !== undefined) update.title = title;
      if (date !== undefined) update.date = date;

      const result = await db.collection(POSTS).findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: 'after' }
      );
      if (!result.value) return res.status(404).json({ error: 'Not found' });
      res.json(result.value);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to update post' });
    }
  });

  // DELETE /api/posts/:id
  router.delete('/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

      const result = await db.collection(POSTS).deleteOne({ _id: id });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ ok: true, deletedId: id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
};