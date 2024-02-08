const util = require('./mongodbutil.js');

class TodoApp {
  constructor(uri, database, posts, counter) {
    this.uri = uri
    this.database = database
    this.posts = posts
    this.counter = counter
  }
  async runAddPost(req, resp) {
    try {
      let query = {name : 'Total Post'};
      let res = await util.read(this.uri, this.database, this.counter, query)
      let totalPost = 0;
      if (res.length != 0) {
        totalPost = res[0].totalPost;
        console.log(res);
      } else {
        query = { name : 'Total Post', totalPost : 0};
        await util.create(this.uri, this.database, this.counter, query);
      }

      query = { _id : totalPost + 1, title : req.body.title, date : req.body.date};
      res = await util.create(this.uri, this.database, this.posts, query);
      
      query = {name : 'Total Post'};
      const stage = {$inc: {totalPost: 1}}
      await util.update(this.uri, this.database, this.counter, query, stage);
      this.runListGet(req, resp);
    } catch (e) {
      console.error(e);
    }
  }
  async runListGet(req, resp) {
      try {
        let res = await util.read(this.uri, this.database, this.posts, {}) // {} query returns all documents
        const query = { posts: res };
        resp.render('list.ejs', query)
      } catch (e) {
        console.error(e);
      } 
  }
  async runDeletePost(req, resp) {
    try {
      req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
      console.log(req.body._id);
      await util.delete_document(this.uri, this.database, this.posts, req.body)

      const query = {name : 'Total Post'};
      const stage = { $inc: {totalPost:-1} };
      await util.update(this.uri, this.database, this.posts, query, stage)

      console.log('Delete complete')
      resp.send('Delete complete')
    }
    catch (e) {
      console.error(e);
    } 
  }
}

module.exports.TodoApp = TodoApp;