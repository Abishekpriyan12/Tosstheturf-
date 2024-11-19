const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
