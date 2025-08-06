// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:    { type: String }, // e.g. /uploads/users/1234.jpg
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
