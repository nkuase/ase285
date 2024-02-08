//MongoDB module import
const {URI} = require('./_config.js');
const util = require('../util/mongodbutil0.js')

//Built in nodejs module for reading JSON files
// const filePath = 'ase_courses.json';

// Be sure to make database and courses
const databaseName = 'asecourses';
const collectionName = 'courses';

//Asynchronous code block that uses await keywords to run the specified CRUD operations in the right order. 
(async () => {
  const client = await util.connect(URI);

  await util.create(client, databaseName, collectionName, {name: "Unix Systems", professor: "Samuel Cho", department: "Computer Science"})
  await util.read(client, databaseName, collectionName, {"professor":"Samuel Cho"});
  await util.update(client, databaseName, collectionName, {"professor":"Samuel Cho"}, {$set: {"professor":"Professor x"}});
  // await delete_document(client, databaseName, collectionName, {"professor":"Professor x"});

  //upload(client, databaseName, collectionName, filePath);
  await client.close();
})();

// { $set: update }
