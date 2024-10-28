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
  location: {
    type: String,
    required: true,
    enum: ['Cambridge', 'Waterloo', 'Kitchner'], 
  },
  phone: {
    type: String,
    required: true,
  },
  amenities: amenitiesSchema, 
  timing: {
    type: String,
    required: true,
    enum: ['5 AM to 9 AM', '9 AM to 1 PM', '1 PM to 5 PM', '5 PM to 9 PM'], 
  },
  mainImage: {
    type: String,
    required: true, 
  },
  sliderImages: {
    type: [String], 
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3; 
      },
      message: (props) => `${props.value} does not contain at least 3 images!`,
    },
  },
  sportType: {
    type: String,
    required: true, // New field for the type of sport
  },
  price: {
    type: Number,
    required: true, // New field for the price
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5, 
  },
  firstTimeDiscount: {
    type: String, // New field for first-time discount
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
