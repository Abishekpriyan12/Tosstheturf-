const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const NavItem = require('../models/NavItems');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const resolvers = {
  Query: {
    // Fetch all navigation items
    getNavItems: async () => {
      try {
        return await NavItem.find();
      } catch (error) {
        console.error("Failed to fetch navigation items:", error);
        throw new Error("Failed to fetch navigation items.");
      }
    },

    // Fetch all turfs
    getTurfs: async () => {
      try {
        return await Turf.find();
      } catch (error) {
        console.error("Failed to fetch turfs:", error);
        throw new Error("Failed to fetch turfs.");
      }
    },

    // Fetch specific turf by ID
    turf: async (_, { id }) => {
      try {
        const turf = await Turf.findById(id);
        if (!turf) {
          throw new Error("Turf not found.");
        }
        return turf;
      } catch (error) {
        console.error("Error fetching turf details:", error);
        throw new Error("Failed to fetch turf details.");
      }
    },

    // Fetch bookings for a specific user
    getBookings: async (_, { userId }) => {
      try {
        return await Booking.find({ userId });
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings.");
      }
    },

    // Fetch bookings by turf and date
    getBookingsByTurfAndDate: async (_, { turfId, date }) => {
      try {
        const bookings = await Booking.find({ turfId, date });
        return bookings.map((booking) => ({
          ...booking.toObject(),
          time: booking.time || [], // Ensure time is always an array
        }));
      } catch (error) {
        console.error("Error fetching bookings by turf and date:", error);
        throw new Error("Failed to fetch bookings.");
      }
    },
    

    // Fetch reviews for a specific turf with average rating
    getReviews: async (_, { turfId }) => {
      try {
        const reviews = await Review.find({ turfId }).sort({ createdAt: -1 });
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            : 0;

        return {
          averageRating,
          reviews,
        };
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews.");
      }
    },  
    getFullyBookedDates: async (_, { turfId }) => {
      try {
        const turf = await Turf.findById(turfId);
        if (!turf) {
          throw new Error("Turf not found.");
        }
    
        // Generate time slots based on turf's timing
        const [openingTime, closingTime] = turf.timing.split(" to ");
        const totalSlots = parseInt(closingTime.split(" ")[0]) - parseInt(openingTime.split(" ")[0]);
    
        const bookings = await Booking.find({ turfId });
    
        // Count bookings by date
        const bookingCountByDate = bookings.reduce((acc, booking) => {
          acc[booking.date] = (acc[booking.date] || 0) + booking.time.length;
          return acc;
        }, {});
    
        // Fully booked dates
        const fullyBookedDates = Object.keys(bookingCountByDate).filter(
          (date) => bookingCountByDate[date] >= totalSlots
        );
    
        return fullyBookedDates;
      } catch (error) {
        console.error("Error fetching fully booked dates:", error);
        throw new Error("Failed to fetch fully booked dates.");
      }
    },      
  },

  Mutation: {
    // User signup
    signup: async (_, {id, firstName, lastName, email, password, role }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          id,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
        });

        await user.save();

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

    // User login
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

    // Add a new turf
    addTurf: async (_, { turfName, address, location, phone, amenities, timing, mainImage, sliderImages, sportType, price, firstTimeDiscount }) => {
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
        // Ensure turfId is valid
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
          throw new Error("Invalid turf ID.");
        }
    
        // Check for existing bookings in the provided slots
        const existingBookings = await Booking.find({
          turfId,
          date,
          time: { $in: time },
        });
    
        if (existingBookings.length > 0) {
          throw new Error("One or more selected time slots are already booked.");
        }
    
        // Create a new booking without validating userId as ObjectId
        const newBooking = new Booking({
          userId, // Store userId as a raw string
          turfId,
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
    

    // Cancel a booking
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

    // Add a new review
    addReview: async (_, { turfId, username, rating, review }) => {
      try {
        const newReview = new Review({
          turfId,
          username,
          rating,
          review,
        });

        await newReview.save();
        return newReview;
      } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to add review.");
      }
    },
  },
};

module.exports = resolvers;
