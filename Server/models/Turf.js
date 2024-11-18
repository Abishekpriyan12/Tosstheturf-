const mongoose = require('mongoose');

const amenitiesSchema = new mongoose.Schema({
  parking: { type: Boolean, default: false },
  drinkingWater: { type: Boolean, default: false },
  spareKits: { type: Boolean, default: false },
  nonAC: { type: Boolean, default: false },
});

const turfSchema = new mongoose.Schema({
  turfName: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true, enum: ['Cambridge', 'Waterloo', 'Kitchner'] },
  phone: { type: String, required: true },
  amenities: amenitiesSchema,
  timing: { type: String, required: true, enum: ['5 AM to 9 AM', '9 AM to 1 PM', '1 PM to 5 PM', '5 PM to 9 PM'] },
  mainImage: { type: String, required: true },
  sliderImages: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: (props) => `${props.value} must contain at least 3 images`,
    },
  },
  sportType: { type: String, required: true },
  price: { type: Number, required: true },
  ratings: { type: [Number], default: [] },  // Array for individual ratings
  averageRating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating
  firstTimeDiscount: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;
