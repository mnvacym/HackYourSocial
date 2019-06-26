const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const crypto = require('crypto');
const Sgmail = require('@sendgrid/mail');
Sgmail.setApiKey(config.get('sendgrid'));

// @route   GET api/auth
// @desc    Gets the authorized user
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Password is required!').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials!' }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  },
);

// @route   POST api/auth/saveresethash
// @desc    Reset password
// @access  public
router.post(
  '/saveresethash',
  [check('email', 'Please include a valid email!').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let result;
    try {
      // check and make sure the email exists
      const foundUser = await User.findOne({ email: req.body.email });

      // If the user exists, save their password hash
      const timeInMs = Date.now();
      const hashString = `${req.body.email}${timeInMs}`;
      const secret = config.get('sendgridSecret');
      const hash = crypto
        .createHmac('sha256', secret)
        .update(hashString)
        .digest('hex');

      foundUser.passwordReset = hash;
      foundUser.save(err => {
        if (err) {
          console.log('save error');
          return res.status(400).json({
            errors: [
              {
                msg:
                  'Something went wrong while attempting to reset your password. Please Try again!',
              },
            ],
          });
        }

        const message = {
          to: foundUser.email, //email variable
          from: 'hyfproject19@gmail.com',
          subject: 'Reset Your Password',
          html: `<h1>Hi ${foundUser.name},</h1>
        <p> Please click the below link to reset your password</p>      
        <a href="http://localhost:3000/auth/change-password/${
          foundUser.passwordReset
        }" target="_blank"> Take me to the reset page</a>
        <p>If you didn't make this request, feel free to ignore it!</p>`,
        };

        Sgmail.send(message, (error, result) => {
          if (error) {
            console.log('send error');
            return res.status(400).json({
              errors: [{ msg: 'Something went wrong while attempting to send the email.' }],
            });
          } else {
            result = res.send(JSON.stringify({ success: true }));
          }
        });
      });
    } catch (err) {
      console.log('user does not exist');
      return res.status(400).json({
        errors: [
          {
            msg: 'Something went wrong while attempting to reset your password. Please Try again!',
          },
        ],
      });
    }
    return result;
  },
);

// @route   POST api/auth/savepassword
// @desc    Save password
// @access  public
router.post(
  '/savepassword',
  [check('password', 'Please enter a password with 6 or more characters!').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let result;
    try {
      const { password, hash: passwordReset } = req.body;

      // look up user in the DB based on reset hash
      const foundUser = await User.findOne({ passwordReset });

      // If the user exists save their new password
      if (foundUser) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        foundUser.password = newPassword;
        foundUser.passwordReset = '';

        // once the password's set, save the user object
        foundUser.save();
        result = res.send(JSON.stringify({ success: true }));
      } else {
        // result = res.send(JSON.stringify({ error: 'Reset hash not found in database.' }));
        return res.status(400).json({
          errors: [{ msg: 'Reset hash not found in database!' }],
        });
      }
    } catch (err) {
      console.error(err);

      //result = res.send(JSON.stringify({ error: 'There was an error connecting to the database.' }));
      return res.status(500).json({
        errors: [{ msg: 'There was an error connecting to the database.!' }],
      });
    }
    return result;
  },
);

module.exports = router;
