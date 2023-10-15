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
const port = args.length > 0 ? parseInt(args[0]) : process.env.PORT || 3004;

// ---------------------------------------------------------- Kafka producer setup START----------------------------------------------------------
const { Kafka } = require("kafkajs");

// Create a Kafka instance with your local broker(s) configuration
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"], // Update with your local Kafka broker details
});

// Create a Kafka consumer
const consumer = kafka.consumer({ groupId: "follower-service-group" }); // A unique group ID for the consumer

const run = async () => {
  // Connect the consumer to the Kafka cluster
  await consumer.connect();

  // Subscribe to the topic(s) you want to consume from
  await consumer.subscribe({ topic: "test-posts" }); // Update with your topic name

  // Start consuming messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const newPostData = JSON.parse(message.value.toString());
      console.log("CONSUMED", newPostData);
      // Handle the new post event by updating followers' news feeds
      await updateUserNewsFeeds(newPostData.userId, newPostData.postId);
    },
  });
};

consumer.on("consumer.crash", () => {
  // Handle consumer crashes or errors here
  console.error("Consumer crashed.");
});

run().catch(console.error);

// Function to update followers' news feeds
async function updateUserNewsFeeds(userId, postId) {
  // Retrieve followers of the user
  const user = await User.findOne({ userId });
  if (!user) {
    console.error("User not found:", userId);
    return;
  }
  console.log("FOUND USER:", user);
  const followers = user.followers;

  // Update each follower's news feed with the new post ID
  for (const followerId of followers) {
    const follower = await User.findOne({ userId: followerId });
    if (follower) {
      follower.newsFeed.push(postId);
      await follower.save();
    } else {
      console.error("Follower not found:", followerId);
    }
  }
}

// ---------------------------------------------------------- Kafka producer setup END----------------------------------------------------------

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

app.listen(port, () => {
  console.log(`Follower Service running on port ${port}`);
});
