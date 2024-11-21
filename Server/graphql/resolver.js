const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const NavItem = require('../models/NavItems');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Stripe= require("stripe")

const stripe = new Stripe("sk_test_51QMj2AFVBeJqSxXd0U2pvOTdrVtnwJIYjRmH7VcZZSWukqemGyN2GX2v1l4hol8314gG6seeqn9lrsZ26HgXpjyV00Fmninryb");
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const resolvers = {
  Query: {
      getUser: async (_, { id }) => {
        try {
          console.log("Received ID in getUser resolver:", id); // Debugging log
      
          if (!id) {
            throw new Error("No ID provided to getUser.");
          }
      
          
          const user = await User.findOne({ id }); 
      
          if (!user) {
            console.error("User not found for ID:", id);
            throw new Error("User not found.");
          }
      
          console.log("Fetched User:", user);
          return user;
        } catch (error) {
          console.error("Error in getUser resolver:", error);
          throw new Error("Failed to fetch user data.");
        }
      },
      
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
        return await Turf.find({ status: "Approved" }); // Only fetch approved turfs
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
    getAllBookings: async () => {
      try {
        const bookings = await Booking.find()
          .populate("turfId", "turfName")
          .exec();

        return bookings.map((booking) => ({
          turfName: booking.turfId.turfName,
          userId: booking.userId,
          duration: booking.duration,
          time: booking.time,
          price: booking.price,
          date: booking.date,
        }));
      } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw new Error("Failed to fetch booking details.");
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
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              reviews.length
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

    // Fetch fully booked dates
    getFullyBookedDates: async (_, { turfId }) => {
      try {
        const turf = await Turf.findById(turfId);
        if (!turf) {
          throw new Error("Turf not found.");
        }

        // Generate time slots based on turf's timing
        const [openingTime, closingTime] = turf.timing.split(" to ");
        const totalSlots =
          parseInt(closingTime.split(" ")[0]) -
          parseInt(openingTime.split(" ")[0]);

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

    // Fetch pending turfs for admin approval
    getPendingTurfs: async () => {
      try {
        return await Turf.find({ status: "Pending" });
      } catch (error) {
        console.error("Error fetching pending turfs:", error);
        throw new Error("Failed to fetch pending turfs.");
      }
    },
    getOwnerTurfs: async (_, { ownerName }) => {
      try {
        return await Turf.find({ ownerName });
      } catch (error) {
        console.error("Error fetching turfs for owner:", error);
        throw new Error("Failed to fetch owner turfs.");
      }
    },
    getOwnerBookings: async (_, { turfId }) => {
      try {
        const bookings = await Booking.find({ turfId });
        return bookings.map((booking) => ({
          userId: booking.userId, // Return userId as a string
          time: booking.time,
          duration: booking.duration,
          price: booking.price,
        }));
      } catch (error) {
        console.error("Error fetching bookings:", error);
        throw new Error("Failed to fetch bookings.");
      }
    },
  },

  Mutation: {
    // User signup
    signup: async (_, { id, firstName, lastName, email, password, role }) => {
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
          throw new Error(
            `User role '${user.role}' does not match the requested role '${role}'.`
          );
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

     updateUser : async (_, { id, firstName, lastName, email }) => {
      try {
        
        const updatedUser = await User.findOneAndUpdate(
          { id },  
          { firstName, lastName, email },
          { new: true } 
        );
    
        if (!updatedUser) {
          throw new Error("User not found.");
        }
    
        // Return the updated user details return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user.");
      }
    },
    

    // Add a new turf
    addTurf: async (
      _,
      {
        turfName,
        ownerName,
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
        status,
      }
    ) => {
      try {
        const newTurf = new Turf({
          turfName,
          ownerName,
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
          status, // New turf starts with Pending status
        });

        await newTurf.save();
        return newTurf;
      } catch (error) {
        console.error("Error adding turf:", error);
        throw new Error("Failed to add turf.");
      }
    },

    // Approve a turf
    approveTurf: async (_, { turfId }) => {
      try {
        const turf = await Turf.findByIdAndUpdate(
          turfId,
          { status: "Approved" },
          { new: true }
        );
        if (!turf) {
          throw new Error("Turf not found.");
        }
        return turf;
      } catch (error) {
        console.error("Error approving turf:", error);
        throw new Error("Failed to approve turf.");
      }
    },

    // Reject a turf
    rejectTurf: async (_, { turfId }) => {
      try {
        const turf = await Turf.findByIdAndUpdate(
          turfId,
          { status: "Rejected" },
          { new: true }
        );
        if (!turf) {
          throw new Error("Turf not found.");
        }
        return turf;
      } catch (error) {
        console.error("Error rejecting turf:", error);
        throw new Error("Failed to reject turf.");
      }
    },

    // // Create a new booking
    // createBooking: async (
    //   _,
    //   { userId, turfId, turfName, date, time, duration, price }
    // ) => {
    //   try {
    //     // Ensure turfId is valid
    //     if (!mongoose.Types.ObjectId.isValid(turfId)) {
    //       throw new Error("Invalid turf ID.");
    //     }

    //     // Check for existing bookings in the provided slots
    //     const existingBookings = await Booking.find({
    //       turfId,
    //       date,
    //       time: { $in: time },
    //     });

    //     if (existingBookings.length > 0) {
    //       throw new Error(
    //         "One or more selected time slots are already booked."
    //       );
    //     }

    //     // Create a new booking without validating userId as ObjectId
    //     const newBooking = new Booking({
    //       userId,
    //       turfName,
    //       turfId,
    //       date,
    //       time,
    //       duration,
    //       price,
    //     });

    //     await newBooking.save();
    //     return newBooking;
    //   } catch (error) {
    //     console.error("Error creating booking:", error);
    //     throw new Error("Failed to create booking.");
    //   }
    // },

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

    //Stripe
    createPaymentIntent: async (_, { amount, currency }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method_types: ['card'],
        });
        return {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        };
      } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new Error("Failed to create payment intent.");
      }
    },

    confirmBooking: async (_, { paymentIntentId, userId, turfId,turfName, date, time, duration, price }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
          throw new Error("Invalid turf ID.");
        }
    
        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: 'pm_card_visa', // Test card 
          });
    
          if (paymentIntent.status !== "succeeded") {
            console.log("Payment Status:", paymentIntent.status);
            throw new Error("Payment not successful. Booking cannot be completed.");
          }
        }
    
        const newBooking = new Booking({
          userId,
          turfId,
          turfName,
          date,
          time,
          duration,
          price,
        });
    
        await newBooking.save();
    
        return newBooking;
      } catch (error) {
        console.error("Error confirming booking:", error);
        throw new Error("Failed to confirm booking.");
      }
    },
    
    

  },
};

module.exports = resolvers;
