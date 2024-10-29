const bcrypt = require('bcrypt');
const NavItem = require("../models/NavItems");
const User = require("../models/User");
const Turf = require('../models/Turf');
const Booking = require('../models/Booking'); // Import the Booking model
const mongoose = require('mongoose');


const resolvers = {
  Query: {
    getNavItems: async () => {
      try {
        return await NavItem.find();
      } catch (error) {
        console.error("Failed to fetch navigation items:", error);
        throw new Error("Failed to fetch navigation items.");
      }
    },

    getTurfs: async () => {
      try {
        return await Turf.find();
      } catch (error) {
        console.error("Failed to fetch turfs:", error);
        throw new Error("Failed to fetch turfs.");
      }
    },

    turf: async (_, { id }) => {
      try {
        const turf = await Turf.findById(id); // Use Turf directly
        if (!turf) {
          throw new Error("Turf not found");
        }
        return turf;
      } catch (error) {
        console.error("Error fetching turf details:", error);
        throw new Error("Error fetching turf details");
      }
    },

    getBookings: async (_, { turfId, date }) => {
      try {
        const bookings = await Booking.find({ turfId, date });
        console.log("Fetched bookings:", bookings); // Add this log to see what is returned
        return bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings.");
      }
    },
    getBookingsByTurfAndDate: async (_, { turfId, date }) => {
      try {
        const bookings = await Booking.find({ turfId, date });
        console.log("Fetched bookings:", bookings);
        return bookings;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings.");
      }
    }
  },

  Mutation: {
    signup: async (_, { firstName, lastName, email, password, role }) => {
      try {
        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
        });

        // Save the user
        await user.save();

        // Return the created user (or a subset of its properties)
        return {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        console.error("Error in signup resolver:", error);
        throw new Error("Failed to create user.");
      }
    },

    login: async (_, { email, password, role }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error(`No user found with email: ${email}`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password. Please try again.");
        }

        if (user.role !== role) {
          throw new Error(`User role '${user.role}' does not match the requested role '${role}'.`);
        }

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        console.error("Error in login resolver:", error);
        throw new Error("Login failed.");
      }
    },

    addTurf: async (_, { turfName, address, location, phone, amenities, timing, mainImage, sliderImages, sportType, price, rating, firstTimeDiscount }) => {
      try {
        const newTurf = new Turf({
          turfName,
          address,
          location,
          phone,
          amenities,
          timing,
          mainImage,
          sliderImages,
          sportType,
          price,
          rating,
          firstTimeDiscount,
        });

        await newTurf.save();
        return newTurf;
      } catch (error) {
        console.error("Error adding turf:", error);
        throw new Error("Failed to add turf.");
      }
    },

    createBooking: async (_, { userId, turfId, date, time, duration, price }) => {
      try {
        // Convert userId and turfId to ObjectId if they are not already
        const validUserId = mongoose.Types.ObjectId(userId);
        const validTurfId = mongoose.Types.ObjectId(turfId);
    
        // Check if the time slot is already booked for the given turf and date
        const existingBooking = await Booking.findOne({ turfId: validTurfId, date, time });
        if (existingBooking) {
          throw new Error("This time slot is already booked.");
        }
    
        const newBooking = new Booking({
          userId: validUserId,
          turfId: validTurfId,
          date,
          time,
          duration,
          price,
        });
    
        await newBooking.save();
        return newBooking;
      } catch (error) {
        console.error("Error creating booking:", error);
        throw new Error("Failed to create booking.");
      }
    },

    cancelBooking: async (_, { bookingId }) => {
      try {
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
          throw new Error("Booking not found.");
        }
        return "Booking canceled successfully.";
      } catch (error) {
        console.error("Error canceling booking:", error);
        throw new Error("Failed to cancel booking.");
      }
    },
  },
};

module.exports = resolvers;
