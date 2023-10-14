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
const port = args.length > 0 ? parseInt(args[0]) : process.env.PORT || 3001;

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
        // savedPosts: req.body.savedPosts,
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

// Update user following and follower of the user begin followed and return the updated object
app.post("/addFollowing", async (req, res) => {
  try {
    // Update the user's "following" list
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $push: { following: req.body.followeeId },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.log("No user found with the specified userId.");
      return res.status(404).json("No user found with the specified userId.");
    }

    // Update the followee's "followers" list
    const updatedFolloweeUser = await User.findOneAndUpdate(
      { userId: req.body.followeeId },
      {
        $push: { followers: req.body.userId },
      },
      { new: true } // Return the updated document
    );

    if (!updatedFolloweeUser) {
      console.log("No user found with the specified followeeId.");
      return res
        .status(404)
        .json("No user found with the specified followeeId.");
    }

    console.log("Successfully updated the following and followers!");
    return res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/removeFollowing", async (req, res) => {
  try {
    // Remove the user's ID from the followee's "followers" list
    const updatedFolloweeUser = await User.findOneAndUpdate(
      { userId: req.body.followeeId },
      {
        $pull: { followers: req.body.userId },
      },
      { new: true } // Return the updated document
    );

    if (!updatedFolloweeUser) {
      console.log("No user found with the specified followeeId.");
      return res
        .status(404)
        .json("No user found with the specified followeeId.");
    }

    // Remove the followee's ID from the user's "following" list
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $pull: { following: req.body.followeeId },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.log("No user found with the specified userId.");
      return res.status(404).json("No user found with the specified userId.");
    }

    console.log("Successfully removed the following relationship!");
    return res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json("Internal Server Error");
  }
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
    res.json(postsList);
  } else res.json("Couldn't find posts");
});
// Get posts by User Id
app.post("/postsByUserId", async (req, res) => {
  const postsList = await Post.find({ userId: { $in: req.body.userId } }).sort({
    createdAt: -1,
  });
  if (postsList) {
    res.json(postsList);
  } else res.json("Couldn't find posts for this user");
});
// Get posts by posts Ids
app.post("/postsByPostId", async (req, res) => {
  const postsList = await Post.find({ postId: { $in: req.body.postIds } }).sort(
    { createdAt: -1 }
  );
  if (postsList) {
    res.json(postsList);
  } else res.json("Couldn't find posts with these Ids");
});

// Listener
app.listen(port, () => {
  console.log("Server Running!");
});
