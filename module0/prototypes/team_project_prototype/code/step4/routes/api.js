// routes/api.js
import express from 'express';

// REST API with SQLite (callback style, mounted at /api in index.js).
export function createApiRouter(db) {
  const router = express.Router();

  // GET /api/posts - all posts
  router.get('/posts', (req, res) => {
    const sql = 'SELECT _id, title, date FROM posts ORDER BY _id ASC';

    db.all(sql, [], (err, posts) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch posts' });
      }
      res.json(posts);
    });
  });

  // GET /api/posts/:id - one post
  router.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const sql = 'SELECT _id, title, date FROM posts WHERE _id = ?';

    db.get(sql, [id], (err, doc) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch post' });
      }
      if (!doc) return res.status(404).json({ error: 'Not found' });

      res.json(doc);
    });
  });

  // POST /api/posts - create a post
  router.post('/posts', (req, res) => {
    const { title, date } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title is required' });

    const sql = 'INSERT INTO posts (title, date) VALUES (?, ?)';

    // "function" (not an arrow function) is required to use this.lastID
    db.run(sql, [title, date || ''], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create post' });
      }

      // AUTOINCREMENT generated the id for us
      const doc = { _id: this.lastID, title, date: date || '' };
      res.status(201).json(doc);
    });
  });

  // PUT /api/posts/:id - update a post (only the given fields)
  router.put('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const { title, date } = req.body || {};
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (date !== undefined) {
      updates.push('date = ?');
      values.push(date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE posts SET ${updates.join(', ')} WHERE _id = ?`;

    db.run(sql, values, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to update post' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });

      // Fetch and return the updated document
      db.get('SELECT _id, title, date FROM posts WHERE _id = ?', [id], (err2, doc) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ error: 'Failed to fetch updated post' });
        }
        res.json(doc);
      });
    });
  });

  // DELETE /api/posts/:id - delete a post
  router.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const sql = 'DELETE FROM posts WHERE _id = ?';

    db.run(sql, [id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete post' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Not found' });

      res.json({ ok: true, deletedId: id });
    });
  });

  return router;
}
