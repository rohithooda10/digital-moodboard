const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postId: String,
  userId: String,
  postedAt: Date,
  comments: [String],
  title: String,
  description: String,
  postImageUrl: String,
  postType: String, // created or saved
});

const Post = new mongoose.model("posts", PostSchema);

module.exports = Post;
