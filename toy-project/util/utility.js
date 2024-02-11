const util = require('./mongodbutil.js');

class TodoApp {
  constructor(uri, database, posts, counter) {
    this.uri = uri
    this.database = database
    this.posts = posts
    this.counter = counter
  }
  /*
    Warning: this code has a bug
    Read runDeleteDelete comment.
  */
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
      resp.status(500).send({ error: `Error from runAddPost: ${e.message}` })
    }
  }
  async runListGet(req, resp) {
      try {
        let res = await util.read(this.uri, this.database, this.posts, {}) // {} query returns all documents
        if (res.length == 0) {
          resp.redirect('/');
        } else {
          const query = { posts: res };
          resp.render('list.ejs', query)
        }   
      } catch (e) {
        console.error(e);
        resp.status(500).send({ error: `Error from runListGet: ${e.message}` })
      } 
  }
  /*
    Warning: this code has a bug.
  
    When the post is deleted, totalPost is decreased by 1.
    For example, when we have 3 posts, with id 1,2,3 and the post 1 is deleted, the posts have ids 2,3, and totalPost will be 2.
    So, the new post will have the id 3 (totalPost + 1) and this is not OK because we have two posts with the same id.
    The solution is to make another variable in the counter collection to keep track of the latest post.
    In the example, the latestIdNumber will be the 4 and it is updated only by the runAddPost method, not runDeleteDelete method.
    and use the totalPost to track the total number of the count. 
    It is a good idea to get the real total count from the posts collection (using the API such as collection.countDocuments({})), not adding or deleting one from the totalCount. 
  */
  async runDeleteDelete(req, resp) {
    try {
      req.body._id = parseInt(req.body._id); // the body._id is stored in string, so change it into an int value
      console.log(req.body._id);
      await util.delete_document(this.uri, this.database, this.posts, req.body)

      const query = {name : 'Total Post'};
      const stage = {$inc: {totalPost:-1}};
      await util.update(this.uri, this.database, this.posts, query, stage)

      resp.send('Delete complete')
    }
    catch (e) {
      console.error(e);
      resp.status(500).send({ error: `Error from runDeleteDelete: ${e.message}` })
    } 
  }
  
  async runEditIdGet(req, resp) {
    // DEBUG
    console.log("runEditIdGet")
    console.log(req.params)
    try {
      let query = {_id: parseInt(req.params.id)};
      console.log(query);
      let res = await util.read(this.uri, this.database, this.posts, query)
      console.log({ data: res })
      if (res != null && res.length != 0) {
        resp.render('edit.ejs', { data: res })
      }
      else {
        resp.status(500).send({ error: 'result is null' })
      }
    }
    catch (error) {
        console.log(error)
        resp.status(500).send({ error: `Error from runEditIdGet : ${e.message}` })
    }
  }
  async runEditPut(req, resp) {
    // DEBUG
    let id = parseInt(req.body._id);
    console.log(`runEditPut id: ${req.body.id} title: ${req.body.title} date: ${req.body.date}`)
    let query = {_id: id}
    let update = {$set: {_id:id, title: req.body.title, date: req.body.date}}
    try {
      let res = await util.update(this.uri, this.database, this.posts, query, update);
      console.log(`app.put.edit: Update complete ${res}`)
      resp.redirect('/list')
    }
    catch (e) {
      console.error(e);
      resp.status(500).send({ error: `Error from runEditPut: ${e.message}`})
    }
  }
  
  async runDetailIdGet(req, resp) {
    try {
      let query = { _id: parseInt(req.params.id) }
      let res = await util.read(this.uri, this.database, this.posts, query);
      console.log({ data: res });
      if (res != null && res.length > 0) {
        resp.render('detail.ejs', { data: res })
      }
      else {
        resp.render('error.ejs', { error: `result is null` })
      }
    }
    catch (error) {
      console.log(error)
      resp.status(500).send({ error: `Error from runDetailIdGet: ${e.message}` })
    }
  }
}

module.exports.TodoApp = TodoApp;