const mongoose = require('mongoose');

// Define the schema for the amenities
const amenitiesSchema = new mongoose.Schema({
  parking: { type: Boolean, default: false },
  drinkingWater: { type: Boolean, default: false },
  spareKits: { type: Boolean, default: false },
  nonAC: { type: Boolean, default: false },
});

// Define the schema for the Turf model
const turfSchema = new mongoose.Schema({
  turfName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amenities: amenitiesSchema, // Nested schema for amenities
  timing: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true, // URL for the main image
  },
  sliderImages: {
    type: [String], // Array of URLs for slider images
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3; // Ensure at least 3 images
      },
      message: (props) => `${props.value} does not contain at least 3 images!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
