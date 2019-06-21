const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const generateRandomPass = name => {
  return `${name}123`;
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('google.clientId'),
      clientSecret: config.get('google.secret'),
      callbackURL: 'http://localhost:5000/api/auth/social/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      const {
        id: googleId,
        displayName: name,
        emails: [{ value: email }],
        photos: [{ value: avatar }],
      } = profile;
      //const email = profile.emails[0].value;
      //const googleId = profile.id;
      console.log(profile);
      console.log(name, email, avatar, googleId);
      try {
        // See if user exists
        let user = await User.findOne({ email });

        //if user does not exist create and save user
        if (!user) {
          const password = generateRandomPass(name); // Password is required

          user = new User({
            name,
            email,
            avatar,
            password,
            social: {
              google: googleId,
            },
          });

          // Encrypt password
          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(user.password, salt);
          await user.save();
          console.log('user saved', user);
        }

        // Return jsonwebtoken
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          console.log('token:', token);
          done(null, token);
        });
      } catch (err) {
        console.log(err.message);
        done(err, null);
      }
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
);

// Serialization on cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialization from cookie
passport.deserializeUser((user, done) => {
  // @Todo - Get user from db using by id
  done(null, user); // This user is going to be passed
});*/
