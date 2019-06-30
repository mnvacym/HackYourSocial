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
    google: { type: String },
    github: { type: String },
    facebook: { type: String },
  },
});

module.exports = User = mongoose.model('user', UserSchema);
