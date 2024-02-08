const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const TodoTask = require("./models/TodoTask");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECT);
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running"));
}

app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// CRUD processing

app.get("/", async (req, res) => {
  try {
    const tasks = await TodoTask.find({})
    res.render("todo.ejs", { todoTasks: tasks });
  }
  catch (err) {
    console.error(err);
  }
});

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
      res.send(500, err);
    }
});

//UPDATE
app.route("/edit/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    let tasks = await TodoTask.find({})
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
  } catch (err) {
    res.send(500, err);
  }
})
.post(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndUpdate(id, { content: req.body.content })
    res.redirect("/");
  } catch (err) {
    res.send(500, err);
  }
});

//DELETE
app.route("/remove/:id").get(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndRemove(id)
    res.redirect("/");
  } catch (err) {
    res.send(500, err);
  }
});
