/**
 * View Routes - Express Router for EJS Templates
 * 
 * This router handles all view-related routes that render EJS templates.
 * It works with any database through the ORDB abstraction layer.
 */

import express from 'express';

/**
 * Create and configure the view router
 * @param {Object} db - Database instance (ORDB bridge)
 * @returns {express.Router} Configured Express router
 */
export function createRouter(db) {
  const router = express.Router();
  const COLLECTION = 'posts';

  /**
   * GET / - Home page with write form
   * Renders the form for creating a new post
   */
  router.get('/', (req, res) => {
    res.render('write.ejs');
  });

  /**
   * POST /add - Create a new post from form submission
   * Redirects to home page after successful creation
   */
  router.post('/add', async (req, res) => {
    try {
      const { title, date } = req.body;
      
      await db.insertOne(COLLECTION, {
        title: title || '',
        date: date || ''
      });
      
      res.redirect('/');
    } catch (error) {
      console.error('Error adding post:', error);
      res.status(500).send('Failed to add post');
    }
  });

  /**
   * GET /list - Display all posts
   * Renders the list view with all posts sorted by ID
   */
  router.get('/list', async (req, res) => {
    try {
      const posts = await db.findAll(COLLECTION, {}, { sort: { _id: 1 } });
      res.render('list.ejs', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Failed to fetch posts');
    }
  });

  /**
   * GET /detail/:id - Display single post detail
   * Renders the detail view for a specific post
   */
  router.get('/detail/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (Number.isNaN(id)) {
        return res.status(400).send('Invalid id');
      }
      
      const data = await db.findOne(COLLECTION, { _id: id });
      
      if (data) {
        res.render('detail.ejs', { data });
      } else {
        res.status(404).send('Post not found');
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
      res.status(500).send('Error fetching post detail');
    }
  });

  /**
   * GET /edit/:id - Display edit form for a post
   * Renders the edit form populated with existing post data
   */
  router.get('/edit/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (Number.isNaN(id)) {
        return res.status(400).send('Invalid id');
      }
      
      const data = await db.findOne(COLLECTION, { _id: id });
      
      if (data) {
        res.render('edit.ejs', { data });
      } else {
        res.status(404).send('Post not found');
      }
    } catch (error) {
      console.error('Error fetching edit form:', error);
      res.status(500).send('Error fetching post for editing');
    }
  });

  /**
   * PUT /edit - Update a post from form submission
   * Updates the post and redirects to the list page
   */
  router.put('/edit', async (req, res) => {
    try {
      const id = parseInt(req.body.id, 10);
      
      if (Number.isNaN(id)) {
        return res.status(400).send('Invalid id');
      }
      
      await db.updateOne(
        COLLECTION,
        { _id: id },
        {
          title: req.body.title,
          date: req.body.date
        }
      );
      
      res.redirect('/list');
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).send('Failed to update post');
    }
  });

  /**
   * DELETE /delete - Delete a post (AJAX request)
   * Returns JSON response indicating success or failure
   */
  router.delete('/delete', async (req, res) => {
    try {
      const id = parseInt(req.body._id, 10);
      
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid id' });
      }
      
      const deleted = await db.deleteOne(COLLECTION, { _id: id });
      
      if (!deleted) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      res.json({ ok: true, deletedId: id });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  return router;
}

export default { createRouter };
