const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  title: String,
  text: String,
  date: { type: Date, default: Date.now },
});

const post = mongoose.model("post", postSchema);
module.exports = post;
