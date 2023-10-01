const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  profilePicture: String,
  userId: String,
  username: String,
  email: String,
  // password: String, // no need to save here, since authentication is taken care by firebase
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  createdPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  searchHistory: [{ term: String, searchAt: Date }],
});

const User = new mongoose.model("users", UserSchema);

module.exports = User;
