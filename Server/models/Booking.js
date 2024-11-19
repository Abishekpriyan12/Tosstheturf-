const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  },
  userId: {
    type: String, 
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: [String], // Updated to an array of strings for multiple time slots
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
