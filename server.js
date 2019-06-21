const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const config = require('config');
const passport = require('passport');
const passportSetup = require('./middleware/passportSetup');
const cookieSession = require('cookie-session');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 100,
    keys: [config.get('session.cookieKey')],
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/auth/social', require('./routes/api/socialAuth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
