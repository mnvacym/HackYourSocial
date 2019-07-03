const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const generateRandomPass = name => {
  return `${name}123`;
};

const checkAndCreateUser = async (accessToken, refreshToken, profile, done, account) => {
  const {
    id: socialId,
    displayName: name,
    username,
    emails: [{ value: email }],
    photos: [{ value: avatar }],
  } = profile;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    //if user does not exist create and save user
    if (!user) {
      const password = generateRandomPass(name + socialId); // Password is required

      user = new User({
        name: name || username,
        email,
        avatar,
        password,
        social: {
          [account]: socialId,
        },
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    user.isVerified = true;
    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      done(null, token);
    });
  } catch (err) {
    done(err, null);
  }
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleSecret,
      callbackURL: 'http://localhost:5000/api/auth/social/google/redirect',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done),
  ),
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.facebookClientId,
      clientSecret: process.env.facebookSecret,
      callbackURL: 'http://localhost:5000/api/auth/social/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done),
  ),
);

// Github Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.githubClientId,
      clientSecret: process.env.githubSecret,
      callbackURL: 'http://localhost:5000/api/auth/social/github/redirect',
      scope: 'user:email',
    },
    (accessToken, refreshToken, profile, done) =>
      checkAndCreateUser(accessToken, refreshToken, profile, done),
  ),
);
