import express from "express";

export function createRouter(db) {

  const router = express.Router();

  router.get('/', function (_, resp) {
    try {
      resp.render('write.ejs')
    } catch (e) {
      console.error(e);
    }
  });

  router.post('/add', (req, res) => {
    const { title, date } = req.body;
    const sql = 'INSERT INTO posts (title, date) VALUES (?, ?)';

    db.run(sql, [title, date || ''], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to add post');
      }
      res.redirect('/');
    });
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
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).send('Invalid id');
    }

    const sql = 'SELECT _id, title, date FROM posts WHERE _id = ?';

    db.get(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching detail');
      }
      if (data) {
        res.render('detail.ejs', { data });
      } else {
        res.status(404).send('Not found');
      }
    });
  });

  router.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).send('Invalid id');
    }

    const sql = 'SELECT _id, title, date FROM posts WHERE _id = ?';

    db.get(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching edit form');
      }
      if (data) {
        res.render('edit.ejs', { data });
      } else {
        res.status(404).send('Not found');
      }
    });
  });

  router.put('/edit', (req, res) => {
    const id = parseInt(req.body.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).send('Invalid id');
    }

    const sql = 'UPDATE posts SET title = ?, date = ? WHERE _id = ?';

    db.run(sql, [req.body.title, req.body.date, id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to update post');
      }
      res.redirect('/list');
    });
  });

  // Delete route for AJAX request from list.ejs
  router.delete('/delete', (req, res) => {
    const id = parseInt(req.body._id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const sql = 'DELETE FROM posts WHERE _id = ?';

    db.run(sql, [id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete post' });
      }
      res.json({ ok: true, deletedId: id });
    });
  });

  return router;
}
