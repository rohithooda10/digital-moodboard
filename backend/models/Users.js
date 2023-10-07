const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  profilePicture: String,
  userId: String,
  username: String,
  email: String,
  // password: String, // no need to save here, since authentication is taken care by firebase
  followers: [String],
  following: [String],
  likedPosts: [String],
  createdPosts: [String],
  searchHistory: [{ term: String, searchAt: Date }],
});

const User = new mongoose.model("users", UserSchema);

module.exports = User;
