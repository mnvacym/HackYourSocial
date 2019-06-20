const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);
// Callback route to redirect to
router.get('/google/redirect', (req, res) => {
  res.send('This is callback route for google auth');
  res.send(req.user); // @Todo - Redirect this user to profile endpoint
});

// Github
router.get('/github', passport.authenticate('github'));
// Callback route to redirect to
router.get('/google/redirect', (req, res) => {
  res.send('This is callback route for github auth');
  res.send(req.user); // @Todo - Redirect this user to profile endpoint
});

// Facebook
router.get('/facebook', passport.authenticate('facebook'));
// Callback route to redirect to
router.get('/google/redirect', (req, res) => {
  res.send('This is callback route for facebook auth');
  res.send(req.user); // @Todo - Redirect this user to profile endpoint
});

module.exports = router;
