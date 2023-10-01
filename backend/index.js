const express = require("express");
const cors = require("cors");
const User = require("./models/Users");
const Post = require("./models/Posts");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
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
  // console.log(req.body);
  const user = req.body;
  const newUser = User(user);
  await newUser.save();
  res.json(user);
});
// Get all users
app.get("/users", async (req, res) => {
  const usersList = await User.find({});
  if (usersList) {
    console.log(usersList);
    res.json(usersList);
    console.log(usersList);
  } else res.json("Couldn't find users");
});
// Get user by Id
app.post("/userById", async (req, res) => {
  const userFound = await Post.find({ userId: req.body.userId });
  console.log(userFound);
  if (userFound) {
    res.json(userFound);
  } else res.json("Couldn't find user!");
});
// Update user
app.post("/updateUser", (req, res) => {
  User.updateOne(
    { userId: req.body.userId },
    {
      title: req.body.title,
      isDone: req.body.isDone,
      description: req.body.description,
      category: req.body.category,
      time: req.body.time,

      profilePicture: req.body.profilePicture,
      userId: req.body.userId,
      username: req.body.username,
      email: req.body.email,
      followers: req.body.followers,
      following: req.body.following,
      liked: req.body.liked,
      savedPosts: req.body.savedPosts,
      createdPosts: req.body.createdPosts,
      searchHistory: req.body.searchHistory,
    },
    (err, result) => {
      if (err) {
        console.log("error");
        res.json(err);
      } else {
        console.log("RESULT:" + result);
        res.json("Successfully updated !");
      }
    }
  );
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
    // console.log(postsList);
    res.json(postsList);
  } else res.json("Couldn't find posts");
});
// Get posts by Id
app.post("/postsById", async (req, res) => {
  const postsList = await Post.find({ userId: req.body.userId });
  if (postsList) {
    res.json(postsList);
  } else res.json("Couldn't find posts for this user");
});
app.listen(process.env.PORT, () => {
  console.log("Server Running!");
});
