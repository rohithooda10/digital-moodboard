const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: String,
  postedAt: Date,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  title: String,
  description: String,
  postImageUrl: String,
  postType: String, // created or saved
});

const Post = new mongoose.model("posts", PostSchema);

module.exports = Post;
