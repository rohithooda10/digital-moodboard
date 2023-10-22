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

const args = process.argv.slice(2);
const port = args.length > 0 ? parseInt(args[0]) : process.env.PORT || 3003;

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
    res.json(usersList);
  } else res.json("Couldn't find users");
});
// Get user by Id
app.post("/userById", async (req, res) => {
  const userFound = await User.findOne({ userId: req.body.userId });
  if (userFound) {
    res.json(userFound);
  } else res.json("Couldn't find user!");
});
// Update user and return the updated object
app.post("/updateUser", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.body.userId },
      {
        profilePicture: req.body.profilePicture,
        userId: req.body.userId,
        username: req.body.username,
        email: req.body.email,
        // password: String, // no need to save here, since authentication is taken care by firebase
        followers: req.body.followers,
        following: req.body.following,
        likedPosts: req.body.likedPosts,
        savedPosts: req.body.savedPosts,
        createdPosts: req.body.createdPosts,
        searchHistory: req.body.searchHistory,
      },
      { new: true } // This option returns the updated document
    );
    if (updatedUser) {
      console.log("Successfully updated !");
      res.json(updatedUser);
    } else {
      console.log("No user found with the specified userId.");
      res.status(404).json("No user found with the specified userId.");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
