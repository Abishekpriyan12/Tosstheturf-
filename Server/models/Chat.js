const mongoose = require('mongoose');

// Define the schema for the Chat model
const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },    // To link the chat with the user
    message: { type: String, required: true },    // User's message
    botResponse: { type: String, required: true }, // Bot's response
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create and export the Chat model
module.exports = mongoose.model('Chat', chatSchema);
