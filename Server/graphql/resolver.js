const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const NavItem = require('../models/NavItems');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Stripe= require("stripe")
const queriesConfig = require('../config/queriesConfig.json'); // Import the config for queries
const queryResponses = require('../config/queryResponses.json'); 
const sendEmail = require("../config/emailService");
const stripe = new Stripe("sk_test_51QMj2AFVBeJqSxXd0U2pvOTdrVtnwJIYjRmH7VcZZSWukqemGyN2GX2v1l4hol8314gG6seeqn9lrsZ26HgXpjyV00Fmninryb");
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
const Chat = require('../models/Chat');

const resolvers = {
  Query: {
      getUser: async (_, { id }) => {
        try {
          console.log("Received ID in getUser resolver:", id); 
      
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
        return await Turf.find({ status: "Approved" }); 
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
          id: booking._id,
          turfId: {
            id: booking.turfId ? booking.turfId._id.toString() : null,
            turfName: booking.turfId ? booking.turfId.turfName : null,
          },
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
    
    
    

    getBookingsByTurfAndDate: async (_, { turfId, date }) => {
      try {
        const bookings = await Booking.find({ turfId, date });
        return bookings.map((booking) => ({
          ...booking.toObject(),
          time: booking.time || [], 
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
          userId: booking.userId,
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
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with that email.");
        }
    
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password. Please try again.");
        }
    
        // Check if the user role matches the requested role
        if (user.role !== role) {
          throw new Error(`User role '${user.role}' does not match the requested role '${role}'.`);
        }
    
        // Return the user details if everything is correct
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        console.error("Error in login resolver:", error);
        throw new Error(error.message || "Login failed. Please try again.");
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
    
    sendMessage: async (_, { userId, message }) => {
      let botResponse = "Sorry, I didn't understand that.";

      // Loop through query types and check for match
      for (const [queryType, queries] of Object.entries(queriesConfig)) {
        if (queries.some(query => message.toLowerCase().includes(query))) {
          // Dynamically handle responses based on the query type
          switch (queryType) {
            case 'greetings':
              botResponse = queryResponses.greetings;
              break;
            case 'help':
              botResponse = queryResponses.help;
              break;
            case 'priceQuery':
              botResponse = queryResponses.priceQuery;
              break;
            case 'availableTurfs':
              const availableTurfs = await Turf.find({ status: "Approved" });
              botResponse = availableTurfs.length > 0
                ? "Here are the available turfs:\n" + availableTurfs.map(turf => turf.turfName).join('\n')
                : "There are no available turfs at the moment.";
              break;
            case 'bookingHistory':
              const bookings = await Booking.find({ userId });
              botResponse = bookings.length > 0
                ? "Here are your past bookings:\n" + bookings.map(booking => `Turf: ${booking.turfName}, Date: ${booking.date}, Time: ${booking.time}`).join('\n')
                : "You don't have any past bookings.";
              break;
              case 'ratingQuery':
                // Extract the turf name after "turf rating"
                const turfName = message.split("turf rating")[1]?.trim();
              
                if (turfName) {
                  // Use regex for a case-insensitive search
                  const turf = await Turf.findOne({
                    turfName: { $regex: new RegExp(turfName, "i") } // case-insensitive regex search
                  });
              
                  if (turf) {
                    const reviews = await Review.find({ turfId: turf._id }); // Use the turf's ObjectId
                    const averageRating =
                      reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : "No reviews available";
                    botResponse = `The average rating for ${turfName} is ${averageRating} out of 5.`;
                  } else {
                    botResponse = `I couldn't find a turf named ${turfName}. Please check the name again.`;
                  }
                } else {
                  botResponse = "Please specify the turf name to get the rating.";
                }
                break;
              
              
            case 'amenitiesQuery':
              const turf = await Turf.findOne({ userId }); // Assuming we fetch turf info for this user
              botResponse = turf ? `This turf offers the following amenities: ${JSON.stringify(turf.amenities)}` : "Turf not found.";
              break;
            case 'mostRatedTurf':
              const mostRatedTurf = await Turf.findOne({ rating: { $gte: 4.5 } }).sort({ rating: -1 }).limit(1);
              botResponse = mostRatedTurf ? `The most rated turf is ${mostRatedTurf.turfName} with an average rating of ${mostRatedTurf.rating}.` : "No rated turfs available.";
              break;
            case 'mostBookedTurf':
              const mostBookedTurf = await Booking.aggregate([
                { $group: { _id: "$turfName", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
              ]);
              botResponse = mostBookedTurf.length > 0
                ? `The most booked turf is ${mostBookedTurf[0]._id} with ${mostBookedTurf[0].count} bookings.`
                : "No turfs have been booked yet.";
              break;
            default:
              botResponse = "Sorry, I didn't understand that.";
          }
          break; // Stop once a query is matched
        }
      }

      // Store the chat history with user and bot messages
      const newChat = new Chat({
        userId,
        message,
        botResponse,
      });

      await newChat.save();

      return { message, botResponse };
    },

    // Add a new turf
    addTurf: async (
      _,
      {
        turfName,
        ownerName,
        userId,
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
          userId,
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
        // Fetch the turf details
        const turf = await Turf.findById(turfId);
        if (!turf) {
          throw new Error("Turf not found.");
        }

        // Fetch the owner's details using the userId (string)
        const owner = await User.findOne({ id: turf.userId });
        if (!owner) {
          throw new Error("Owner not found for this turf.");
        }

        // Update the turf status to "Approved"
        turf.status = "Approved";
        await turf.save();
        console.log(owner.mail)
        // Send email to the owner's email address
        const emailSubject = `Your Turf "${turf.turfName}" Has Been Approved`;
        const emailText = `
          Dear ${owner.firstName} ${owner.lastName},
    
          Congratulations! Your turf "${turf.turfName}" located at "${turf.address}" has been approved by the admin.
    
          Regards,
          Turf Management System
        `;
        await sendEmail(owner.email, emailSubject, emailText);

        return turf;
      } catch (error) {
        console.error("Error approving turf:", error);
        throw new Error("Failed to approve turf.");
      }
    },
    // Reject a turf
    rejectTurf :async (_, { turfId }) => {
      try {
        // Fetch the turf details
        const turf = await Turf.findById(turfId);
        if (!turf) {
          throw new Error("Turf not found.");
        }
    
        // Fetch the owner's details using the userId (string)
        const owner = await User.findOne({ id: turf.userId });
        if (!owner) {
          throw new Error("Owner not found for this turf.");
        }
    
        // Update the turf status to "Rejected"
        turf.status = "Rejected";
        await turf.save();
        console.log(owner.mail)
    
        // Send email to the owner's email address
        const emailSubject = `Your Turf "${turf.turfName}" Has Been Rejected`;
        const emailText = `
          Dear ${owner.firstName} ${owner.lastName},
    
          We regret to inform you that your turf "${turf.turfName}" located at "${turf.address}" has been rejected by the admin.
    
          Regards,
          Turf Management System
        `;
        await sendEmail(owner.email, emailSubject, emailText);
    
        return turf;
      } catch (error) {
        console.error("Error rejecting turf:", error);
        throw new Error("Failed to reject turf.");
      }
    },

    // Update turf details
    updateTurf: async (_, args) => {
      const {
        id,
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
      } = args;

      try {
        const updatedTurf = await Turf.findByIdAndUpdate(
          id,
          {
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
          },
          { new: true }
        );

        if (!updatedTurf) {
          throw new Error("Turf not found");
        }

        return updatedTurf;
      } catch (error) {
        throw new Error("Failed to update turf: " + error.message);
      }
    },

    // Delete a turf
    deleteTurf: async (_, { id }) => {
      try {
        // Find and delete the turf
        const turf = await Turf.findByIdAndDelete(id);
        if (!turf) {
          throw new Error("Turf not found");
        }
    
        // Delete all bookings associated with the turf
        await Booking.deleteMany({ turfId: id });
    
        return turf;
      } catch (error) {
        console.error("Error deleting turf and related bookings:", error);
        throw new Error("Failed to delete turf: " + error.message);
      }
    },    
    // Create a new booking
    createBooking: async (
      _,
      { userId, turfId, turfName, date, time, duration, price }
    ) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
          throw new Error("Invalid turf ID.");
        }

        const existingBookings = await Booking.find({
          turfId,
          date,
          time: { $in: time },
        });

        if (existingBookings.length > 0) {
          throw new Error(
            "One or more selected time slots are already booked."
          );
        }

        const newBooking = new Booking({
          userId,
          turfName,
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

    confirmBooking: async (_, { paymentIntentId, userId, turfId, turfName, date, time, duration, price }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
          throw new Error("Invalid turf ID.");
        }
    
        if (paymentIntentId) {
          // Retrieve the PaymentIntent instead of confirming it again
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
          if (paymentIntent.status !== "succeeded") {
            console.log("Payment Status:", paymentIntent.status);
            throw new Error("Payment not successful. Booking cannot be completed.");
          }
        }
    
        // Create a new booking after payment is verified
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
