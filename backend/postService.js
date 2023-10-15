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

// ---------------------------------------------------------- Kafka producer setup START----------------------------------------------------------

// const kafka = require("kafka-node");
// const Producer = kafka.Producer;
// const client = new kafka.KafkaClient({ kafkaHost: "your-kafka-broker-host" }); // Replace with your Kafka broker details
// const producer = new Producer(client);

// producer.on("ready", () => {
//   console.log("Kafka Producer is ready");
// });

// producer.on("error", (err) => {
//   console.error("Error initializing Kafka Producer: " + err);
// });

// app.post("/posts", async (req, res) => {
//   const post = req.body;

//   // Save the post to the database
//   const newPost = Post(post);
//   await newPost.save();

//   // Publish a message to Kafka when a new post is created
//   const payload = [
//     {
//       topic: "new-post-topic", // Kafka topic for new posts
//       messages: JSON.stringify({ postId: newPost._id, userId: newPost.userId }),
//     },
//   ];

//   producer.send(payload, (err, data) => {
//     if (err) {
//       console.error("Error sending message to Kafka: " + err);
//     }
//   });

//   res.json(newPost);
// });

// ---------------------------------------------------------- Kafka producer setup END----------------------------------------------------------

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

app.listen(port, () => {
  console.log(`Post Service running on port ${port}`);
});
