import React, { useState, useRef, useEffect } from "react";
import { graphQLCommand } from "../../../util";
import "./ChatBot.css"; // Import the CSS file for styling

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);

  // Assuming userId is available from sessionStorage or passed as a prop
  const userId = sessionStorage.getItem("userId") || "Guest"; // Example: Get userId from sessionStorage

  useEffect(() => {
    // Load chat history from localStorage when the component mounts
    const savedChatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(savedChatHistory);

    // Scroll to the bottom of the chat container on load
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const response = await graphQLCommand(
        `
          mutation sendMessage($userId: String!, $message: String!) {
            sendMessage(userId: $userId, message: $message) {
              message
              botResponse
            }
          }
        `,
        { userId, message }
      );

      const newChat = {
        message: response.sendMessage.message,
        botResponse: response.sendMessage.botResponse,
      };

      // Update the chat history state
      const updatedChatHistory = [...chatHistory, newChat];
      setChatHistory(updatedChatHistory);

      // Save chat history to localStorage
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));

      setMessage(""); // Clear input field

      // Scroll to the bottom of the chat container after sending a message
      if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = () => {
    // Clear the chat history from localStorage on logout
    localStorage.removeItem("chatHistory");
    // Optionally, redirect to the login page or home page
    window.location.reload();
  };

  return (
    <div className="chatbot-container">
      <h3>Ask me Anything..</h3>
      <div className="chat-history" ref={chatHistoryRef}>
        {chatHistory.slice(-5).map((chat, index) => (
          <div key={index} className="chat-message">
            <p className="user-message">
              <strong>{userId}</strong>: {chat.message}
            </p>
            <p className="bot-response">
              <strong>Bot:</strong> {chat.botResponse}
            </p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me something..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default ChatBot;
