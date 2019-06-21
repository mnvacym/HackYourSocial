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
  social: {
    google: { type: String },
    github: { type: String },
    facebook: { type: String },
<<<<<<< HEAD
>>>>>>> baa65c1bed3f5ce301cecd0629cc4b6fd93fb0ca
=======
>>>>>>> baa65c1bed3f5ce301cecd0629cc4b6fd93fb0ca
  },
});

module.exports = User = mongoose.model('user', UserSchema);
