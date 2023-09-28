const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: String,
  postId: String,
  postedAt: Date,
  content: String,
});

const Comment = new mongoose.model("comments", CommentSchema);

module.exports = Comment;
