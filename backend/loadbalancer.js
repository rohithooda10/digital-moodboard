const http = require("http");
const express = require("express");
const httpProxy = require("http-proxy");
const net = require("net");

const app = express();

// Define the ports of your backend servers
const serverPorts = [3001, 3002]; // Example port numbers
let currentServerIndex = 0; // Initialize the index to 0

// Create an array to hold the proxy server instances
const proxyServers = [];

// Create a proxy for each server
for (const port of serverPorts) {
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${port}`,
    ws: true, // Enable WebSocket support if needed
  });
  proxyServers.push({ proxy, port });
}

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
  let availableServer = null;

  // Iterate through the proxyServers array in a round-robin fashion
  for (let i = 0; i < proxyServers.length; i++) {
    const nextServerIndex = (currentServerIndex + i) % proxyServers.length;
    const server = proxyServers[nextServerIndex];

    // Check if the server is available
    isServerAvailable(server.port, (available) => {
      if (available) {
        availableServer = server;
        console.log("Using server on port", server.port);
        availableServer.proxy.web(req, res);
        currentServerIndex = nextServerIndex;
      }
    });

    if (availableServer) {
      break; // Exit the loop once an available server is found
    }
  }

  // If no available servers are found, respond with an error
  if (!availableServer) {
    console.log("No available server");
    // res.status(500).json({ error: "No available server" });
  }
});

// Listen on the load balancer's port
const balancerPort = 8080; // Choose a port for the load balancer
balancer.listen(balancerPort, () => {
  console.log(`Load balancer listening on port ${balancerPort}`);
});
