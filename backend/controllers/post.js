const Post = require("../models/post");
const mongoose = require("mongoose");


const createPost = async (req, res) => {
  if (!req.body.title || !req.body.text)
    return res.status(400).send("Incomplete data");

  const post = new Post({

    userId: req.user._id,
    title: req.body.title,
    text: req.body.text,
    
  });

  const result = await post.save();
  if (!result) return res.status(400).send("Error registering task");
  return res.status(200).send({ result });
};

const listPost = async (req, res) => {
  const post = await Post.find({ userId: req.user._id });
  if (!post || post.length === 0)
    return res.status(400).send("You have no Posts");
  return res.status(200).send({ post });
};



const deletePost = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  const post = await Post.findByIdAndDelete(req.params._id);
  if (!post) return res.status(400).send("Post not found");
  return res.status(200).send({ message: "Post deleted" });
};

module.exports = { createPost, listPost , deletePost };
