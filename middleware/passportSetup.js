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
      clientID: config.get('google.clientId'),
      clientSecret: config.get('google.secret'),
      callbackURL: 'http://localhost:5000/api/auth/social/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      // @Todo - Check if user exists, if so let log in user, if not save on db

      console.log(profile.emails[0].value);
      const email = profile.emails[0].value;

      // all below operation were handled in register, login, user routes before
      // we can refactor the codes make below operation a function and reuse it
      // we can write all code again here

      // find user by email

      //if it already exist the perform login > generate  a jwt token and send it

      // if user does not exist create a user and then send jwt token

      /*       User.findOne({ googleId: profile.id }, (err, user) => {
        console.log(user);
        return done(err, user);
      }); */
      done(null, profile);
    }
  )
);
/*
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
);*/

// Serialization on cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization from cookie
passport.deserializeUser((user, done) => {
  // @Todo - Get user from db using by id
  done(null, user); // This user is going to be passed
});
