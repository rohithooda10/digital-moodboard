const express = require("express");
const cors = require("cors");
const User = require("./models/Users");
const Post = require("./models/Posts");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
const mongodbURL = process.env.DATABASE_CONNECTION_STRING;

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  dbName: "digital-moodboard",
});

// Add a user
app.post("/users", async (req, res) => {
  console.log(req.body);
  const user = req.body;
  const newUser = Post(user);
  await newUser.save();
  res.json(user);
});
// Get all users
app.get("/users", async (req, res) => {
  const usersList = await User.find({});
  if (usersList) {
    console.log(usersList);
    res.json(usersList);
  } else res.json("Couldn't find users");
});
// Add a post
app.post("/posts", async (req, res) => {
  console.log(req.body);
  const post = req.body;
  const newPost = Post(post);
  await newPost.save();
  res.json(post);
});
// Get all posts
app.get("/posts", async (req, res) => {
  const postsList = await Post.find({});
  if (postsList) {
    console.log(postsList);
    res.json(postsList);
  } else res.json("Couldn't find posts");
});
// Get posts by Id
app.post("/postsById", async (req, res) => {
  const postsList = await Post.find({ userId: req.body.userId });
  if (postsList) {
    console.log(postsList);
    res.json(postsList);
  } else res.json("Couldn't find posts for this user");
});
app.listen(process.env.PORT, () => {
  console.log("Server Running!");
});
