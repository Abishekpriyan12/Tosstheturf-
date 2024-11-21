require("dotenv").config(); // Import .env variables
const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Email address from .env
    pass: process.env.EMAIL_PASSWORD, // Email password or app password from .env
  },
});

// Function to send emails
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"Turf Management System" <${process.env.EMAIL_USER}>`, // Sender address
      to, // Recipient's email address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body (optional)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId); 
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw error to handle it in the caller
  }
};

module.exports = sendEmail;
