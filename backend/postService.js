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
const port = args.length > 0 ? parseInt(args[0]) : process.env.PORT || 3002;

// ---------------------------------------------------------- Kafka producer setup ----------------------------------------------------------

const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});
// Create a producer
const producer = kafka.producer();
//----------------------------------------------------------------------------------------------------------------------------------------------//
// Add a post
app.post("/posts", async (req, res) => {
  console.log(req.body);
  const post = req.body;
  const newPost = Post(post);
  await newPost.save();

  // Kafka message push - START
  const response = await producer.connect();

  // Produce a message to a specific topic
  await producer.send({
    topic: "test-posts",
    messages: [
      {
        value: JSON.stringify({
          userId: req.body.userId,
          postId: newPost.postId,
        }),
      },
    ],
  });

  await producer.disconnect();
  // Kafka message push - END

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

app.listen(port, () => {
  console.log(`Post Service running on port ${port}`);
});
