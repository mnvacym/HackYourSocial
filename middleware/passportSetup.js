const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');

const User = require('../models/User');

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientId: config.get('google.clientId'),
      clientSecret: config.get('google.secret'),
      callback: '/auth/social/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      // @Todo - Check if user exists, if so let log in user, if not save on db
      console.log('It is from google callback');
      User.findOne({ googleId: profile.id }, (err, user) => {
        console.log(user);
        return done(err, user);
      });
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientId: config.get('facebook.clientId'),
      clientSecret: config.get('facebook.secret'),
      callback: '/auth/social/facebook/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      // @Todo - Check if user exists, if so let log in user, if not save on db
      console.log('It is from facebook callback');
      User.findOne({ facebookId: profile.id }, (err, user) => {
        console.log(user);
        return done(err, user);
      });
    }
  )
);

// Github Strategy
passport.use(
  new GithubStrategy(
    {
      clientId: config.get('github.clientId'),
      clientSecret: config.get('github.secret'),
      callback: '/auth/social/github/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      // @Todo - Check if user exists, if so let log in user, if not save on db
      console.log('It is from github callback');
      User.findOne({ githubId: profile.id }, (err, user) => {
        console.log(user);
        return done(err, user);
      });
    }
  )
);

// Serialization on cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization from cookie
passport.deserializeUser((id, done) => {
  // @Todo - Get user from db using by id
  done(null, user); // This user is going to be passed
});
