# Digital Moodboard Platform

Digital Moodboard is an advanced web application designed to help users create and curate inspiring collections of images and content to enhance their creative projects and express their emotions. This project utilizes the MERN stack (MongoDB, Express, React, Node.js) to provide a seamless user experience. Additionally, it leverages Google Cloud Platform for authentication, image storage, Kafka for asynchronous newsfeed management, and Unsplash API for a vast selection of inspirational images.

## Snapshots
<img width="1417" alt="1" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/21b3b912-48cf-4389-a53c-53a93ce29b67">
<img width="1423" alt="2" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/9fb30431-ea4a-4b1f-b23f-7f71efa329ff">
<img width="1423" alt="3" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/12fa712e-c08d-463a-9045-9a080839c916">
<img width="1423" alt="4" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/7ff4946f-cb22-48b2-a481-648ec12c412a">
<img width="1423" alt="5" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/6c145a1a-df1e-4e8d-8347-6a6f2010399b">
<img width="1423" alt="6" src="https://github.com/rohithooda10/digital-moodboard/assets/109358642/4f27d8f6-5aea-4ba4-b396-6b96af5f4e6e">


## Table of Contents

- [Features](#features)
  - [User Authentication](#user-authentication)
  - [Image Storage](#image-storage)
  - [Microservices Architecture](#microservices-architecture)
  - [Newsfeed Management](#newsfeed-management)
  - [Social Interaction](#social-interaction)
  - [Recommendation System](#recommendation-system)
  - [Unsplash API Integration](#unsplash-api-integration)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### User Authentication

The platform offers secure and easy sign-in options using Firebase authentication, ensuring that users' data is protected.

### Image Storage

Images are efficiently stored using Google Cloud Platform (GCP) storage, guaranteeing scalability and reliability. Users can upload, manage, and access their images seamlessly.

### Microservices Architecture

The project employs a microservices architecture to improve scalability and load balancing. This allows for individual components to be developed and maintained independently.

### Newsfeed Management

Kafka is used for asynchronous newsfeed management, providing real-time updates to users. Users can see the latest content and interact with it immediately.

### Social Interaction

Enhance the social aspect of the platform by enabling users to follow other users, like photos, and save their favorite images for future reference. These features foster user engagement and community building.

### Recommendation System

The platform offers a personalized user experience by suggesting content based on user interactions. Users receive recommendations tailored to their preferences and behaviors.

### Unsplash API Integration

Access a vast selection of inspirational images from Unsplash, expanding creative possibilities. Users can explore a wide variety of content to include in their moodboards.

## Prerequisites

Before running the project, make sure you have the following components set up:

- Node.js
- MongoDB
- Kafka
- ZooKeeper

## Getting Started
(Note: Firebase.js and unsplash.js files are not tracked for security purpose)
Follow these steps to run the Digital Moodboard Platform:

Ensure that Kafka and ZooKeeper are running before starting the backend services.

### Frontend

1. Navigate to the `frontend` folder.
2. Run the following command to start the frontend:

```shell
npm start
```

### Backend
1. Go to the backend folder.
2. Run the following services using Node.js:

```shell
# Load Balancer:
node loadbalancer.js

# User Service:
node userService.js 3002

# Post Service:
node postService.js 3003

# Follower Service:
node followerService.js 3004
```

## Contributing
We welcome contributions to the project. If you'd like to contribute, please follow our contribution guidelines.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Special thanks to the open-source community for their contributions.
The project relies on various third-party libraries and services, including Firebase, GCP, Kafka, and Unsplash API.









