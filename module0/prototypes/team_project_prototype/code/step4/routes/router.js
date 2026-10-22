import express from 'express';

// Web UI routes with SQLite. The sqlite3 library uses callbacks (not Promises):
//   db.run()  -> INSERT / UPDATE / DELETE      db.all() -> many rows      db.get() -> one row
// Always use "?" placeholders (parameterized queries) to prevent SQL injection.
export function createRouter(db) {
  const router = express.Router();

  // The id arrives as a string ("5"): convert it to a number (NaN means "not a number").
  const toId = (value) => parseInt(value, 10);

  // Create
  router.post('/add', (req, res) => {
    const { title, date } = req.body;
    const sql = 'INSERT INTO posts (title, date) VALUES (?, ?)';

    db.run(sql, [title, date || ''], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to add post');
      }
      res.redirect('/');
    });
  });

  // Read
  router.get('/', (req, res) => {
    res.render('write.ejs');
  });

  router.get('/list', (req, res) => {
    const sql = 'SELECT _id, title, date FROM posts ORDER BY _id ASC';

    db.all(sql, [], (err, posts) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to fetch posts');
      }
      res.render('list.ejs', { posts });
    });
  });

  router.get('/detail/:id', (req, res) => {
    const id = toId(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const sql = 'SELECT _id, title, date FROM posts WHERE _id = ?';

    db.get(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching detail');
      }
      if (!data) return res.status(404).send('Post not found');

      res.render('detail.ejs', { data });
    });
  });

  // Update
  router.get('/edit/:id', (req, res) => {
    const id = toId(req.params.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const sql = 'SELECT _id, title, date FROM posts WHERE _id = ?';

    db.get(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching edit form');
      }
      if (!data) return res.status(404).send('Post not found');

      res.render('edit.ejs', { data });
    });
  });

  router.put('/edit', (req, res) => {
    const id = toId(req.body.id);
    if (Number.isNaN(id)) return res.status(400).send('Invalid id');

    const sql = 'UPDATE posts SET title = ?, date = ? WHERE _id = ?';

    // "function" (not an arrow function) is required to use this.changes
    db.run(sql, [req.body.title, req.body.date, id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to update post');
      }
      if (this.changes === 0) return res.status(404).send('Post not found');

      res.redirect('/list');
    });
  });

  // Delete (the AJAX request from list.ejs)
  router.delete('/delete', (req, res) => {
    const id = toId(req.body._id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const sql = 'DELETE FROM posts WHERE _id = ?';

    db.run(sql, [id], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete post' });
      }
      res.json({ ok: true, deletedId: id });
    });
  });

  return router;
}
