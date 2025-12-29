// models/Counter.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: String,
});

module.exports = mongoose.model("Student", studentSchema);