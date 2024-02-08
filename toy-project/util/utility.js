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
      let stage = {totalPost: totalPost + 1};
      await util.update(this.uri, this.database, this.counter, query, stage);
      resp.send('Stored to Mongodb OK');
    } catch (e) {
      console.error(e);
    }
  }
  async runListGet(req, resp) {
      try {
        let res = await util.read(this.uri, this.database, this.posts, {}) // {} query returns all documents
  //      const posts = db.collection(POSTS);
  //      const res = await posts.find().toArray();
        const query = { posts: res };
        resp.render('list.ejs', query)
      } catch (e) {
        console.error(e);
      } 
  }
}

module.exports.TodoApp = TodoApp;