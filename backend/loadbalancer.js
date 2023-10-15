// LOADBALANCER
const http = require("http");
const express = require("express");
const httpProxy = require("http-proxy");
const net = require("net");

const app = express();

// Define the ports of your backend servers
const postServerPort = 3002;
const userServerPort = 3003;
const followServerPort = 3004;

// Create proxy instances for User and Post services
const userProxy = httpProxy.createProxyServer({
  target: `http://localhost:${userServerPort}`,
  ws: true, // Enable WebSocket support if needed
});

const postProxy = httpProxy.createProxyServer({
  target: `http://localhost:${postServerPort}`,
  ws: true, // Enable WebSocket support if needed
});

const followProxy = httpProxy.createProxyServer({
  target: `http://localhost:${followServerPort}`,
  ws: true, // Enable WebSocket support if needed
});

// Function to check if a server is available on a given port
function isServerAvailable(port, callback) {
  const tester = net.createConnection({ port }, () => {
    tester.end();
    callback(true);
  });

  tester.on("error", () => {
    callback(false);
  });
}

// Create the main load balancer
const balancer = http.createServer((req, res) => {
  // Extract the service route based on the request URL
  const serviceRoute = req.url.split("/")[1];

  if (
    serviceRoute === "userById" ||
    serviceRoute === "users" ||
    serviceRoute === "updateUser"
  ) {
    // User service route
    userProxy.web(req, res);
  } else if (
    serviceRoute === "posts" ||
    serviceRoute === "postsByUserId" ||
    serviceRoute === "postsByPostId"
  ) {
    // Post service route
    postProxy.web(req, res);
  } else if (
    serviceRoute === "addFollowing" ||
    serviceRoute === "removeFollowing"
  ) {
    followProxy.web(req, res);
  } else {
    // Handle other routes or unknown routes here
    console.log("Server not found");
  }
});

// Listen on the load balancer's port
const balancerPort = 8080; // Choose a port for the load balancer
balancer.listen(balancerPort, () => {
  console.log(`Load balancer listening on port ${balancerPort}`);
});
