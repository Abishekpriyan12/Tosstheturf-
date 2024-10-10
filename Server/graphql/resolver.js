const bcrypt = require('bcrypt');
const NavItem = require("../models/NavItems");
const User = require("../models/User");

const resolvers = {
  Query: {
    getNavItems: async () => {
      try {
        return await NavItem.find();
      } catch (error) {
        throw new Error("Failed to fetch navigation items.");
      }
    },
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
    },
    
    
  },
};

module.exports = resolvers;
