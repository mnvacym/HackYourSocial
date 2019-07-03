const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  // password reset
  passwordReset: { type: String, select: false },
  social: {
    google: { type: String, default: null },
    github: { type: String, default: null },
    facebook: { type: String, default: null },
  },
});

module.exports = User = mongoose.model('user', UserSchema);
