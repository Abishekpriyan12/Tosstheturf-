const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema'); // Import schema
const resolvers = require('./resolvers'); // Import resolvers
require('dotenv').config(); // Load environment variables

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server and apply middleware
const startServer = async () => {
  await server.start(); // Await the server start
  server.applyMiddleware({ app }); // Apply middleware after starting the server

  // Start the Express server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
};

// Call the startServer function
startServer().catch(err => {
  console.error("Error starting the server:", err);
});
