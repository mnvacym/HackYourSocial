const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
// Callback route to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('redirect page');
    res.json(req.user);
  }
);

// Github
router.get('/github', passport.authenticate('github'));
// Callback route to redirect to
router.get(
  '/github/redirect',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    res.send('This is callback route for github auth');
    res.send(req.user); // @Todo - Redirect this user to profile endpoint
    res.json(req.user);
  }
);

// Facebook
router.get('/facebook', passport.authenticate('facebook'));
// Callback route to redirect to
router.get(
  '/facebook/redirect',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    res.send('This is callback route for facebook auth');
    res.send(req.user); // @Todo - Redirect this user to profile endpoint
    res.json(req.user);
  }
);

module.exports = router;
