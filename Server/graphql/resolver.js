// graphql/resolvers.js
const NavItem = require("../models/NavItems");

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
};

module.exports = resolvers;
