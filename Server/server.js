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
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


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
    const mongoUri = process.env.MONGO_CONNECTION_STRING; // Make sure this is pointing to your TurfManagementSystem database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Start Apollo Server
    await server.start();

    // Apply Apollo Server middleware
    server.applyMiddleware({ app });

    // Start Express server
    const port = process.env.PORT || 3001;
    app.listen(port, () =>
      console.log(
        `Server ready at http://localhost:${port}${server.graphqlPath}`
      )
    );
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

startServer();
