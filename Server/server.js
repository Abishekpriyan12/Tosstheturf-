// server.js
const express = require("express");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const resolvers = require("./graphql/resolver");

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Local frontend
    'http://localhost:3001', // Local backend testing
    'https://tosstheturf.vercel.app', // Deployed frontend
    'https://studio.apollographql.com' // Apollo Studio (optional)
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers the client is allowed to send
  credentials: true // Allow cookies if required
}));

// GraphQL Type Definitions and Resolvers
const typeDefs = fs.readFileSync(
  path.join(__dirname, "./graphql/schema.graphql"),
  "utf-8"
);

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Connect to MongoDB
    const mongoUri = process.env.MONGO_CONNECTION_STRING;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Start Apollo Server
    await server.start();

    // Apply Apollo Middleware to Express App
    server.applyMiddleware({ app });

    // Start Express Server
    const port = process.env.PORT || 3001;
    app.listen(port, () =>
      console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

startServer();
