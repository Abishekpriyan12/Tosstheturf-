// models/NavItem.js
const mongoose = require('mongoose');

const NavItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const NavItem = mongoose.model('NavItem', NavItemSchema, 'navItems'); // Specify the collection name here

module.exports = NavItem;
