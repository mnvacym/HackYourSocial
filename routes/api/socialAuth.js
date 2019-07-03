const express = require('express');
const passport = require('passport');
const router = express.Router();

const redirectOptions = {
  failureRedirect: 'https://stormy-garden-42594.herokuapp.com/',
  session: false,
};

const sendToken = (req, res) => {
  const token = req.user;
  res.redirect('https://stormy-garden-42594.herokuapp.com/register?token=' + token);
};

// Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
// Callback route to redirect to
router.get('/google/redirect', passport.authenticate('google', redirectOptions), (req, res) =>
  sendToken(req, res)
);

// Github
router.get('/github', passport.authenticate('github'));
// Callback route to redirect to
router.get('/github/redirect', passport.authenticate('github', redirectOptions), (req, res) =>
  sendToken(req, res)
);

// Facebook
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['profile', 'email'],
  })
);
// Callback route to redirect to
router.get('/facebook/redirect', passport.authenticate('facebook', redirectOptions), (req, res) =>
  sendToken(req, res)
);

module.exports = router;
