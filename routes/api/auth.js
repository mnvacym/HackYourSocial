const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator/check');
// reset password .. here I will replace the keys with var. from default.json file
const crypto = require('crypto');

const Sgmail = require('@sendgrid/mail');

Sgmail.setApiKey('put the key here but do not forget to delete it when you want to push');

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
  }
);

// @route   POST api/auth/saveresethash
// @desc    Reset password
// @access  public
router.post('/saveresethash', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // let result;
  try {
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const secret = 'alongrandomstringshouldgohere';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(hashString)
      .digest('hex');
    foundUser.passwordReset = hash;

    foundUser.save(err => {
      if (err) {
        // result = res.send(
        //   JSON.stringify({
        //     error: 'Something went wrong while attempting to reset your password. Please Try again',
        //   })
        // );
        return res.status(400).json({
          errors: [
            {
              msg:
                'Something went wrong while attempting to reset your password. Please Try again!',
            },
          ],
        });
      }

      // // //

      const message = {
        to: foundUser.email, //email variable
        from: 'yaseir.alkhwalda@gmail.com',
        message: `Hi ${foundUser}`,
        html: `<p>https://hackyoursocial.com/account/change-password/${
          foundUser.passwordReset
          }</p> if you didn't make this request, feel free to ignore it!`,
        subject: 'Reset Your Password',
      };

      Sgmail.send(message, (error, result) => {
        if (error) {
          // result = res.send(
          //   JSON.stringify({
          //     error: 'Something went wrong while attempting to send the email.',
          //   })
          // );
          return res.status(400).json({
            errors: [{ msg: 'Something went wrong while attempting to send the email.' }],
          });
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });
    });
  } catch (err) {
    // if the user doesn't exist, error out
    // result = res.send(
    //   JSON.stringify({
    //     error: 'Something went wrong while attempting to reset your password. Please Try again',
    //   })
    // );
    return res.status(400).json({
      errors: [
        { msg: 'Something went wrong while attempting to reset your password. Please Try again!' },
      ],
    });
  }
  // return result;
});

// @route   POST api/auth/savepassword
// @desc    Save password
// @access  public
router.post('/savepassword', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let result;
  try {
    // look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();

    // If the user exists save their new password
    if (foundUser) {
      // user passport's built-in password set method
      foundUser.setPassword(req.body.password, err => {
        if (err) {
          // result = res.send(
          //   JSON.stringify({ error: 'Password could not be saved. Please try again' })
          // );
          return res.status(400).json({
            errors: [{ msg: 'Password could not be saved. Please try again!' }],
          });
        } else {
          // once the password's set, save the user object
          foundUser.save(error => {
            if (error) {
              // result = res.send(
              //   JSON.stringify({ error: 'Password could not be saved. Please try again' })
              // );
              return res.status(400).json({
                errors: [{ msg: 'Password could not be saved. Please try again!' }],
              });
            } else {
              // Send a success message
              result = res.send(JSON.stringify({ success: true }));
            }
          });
        }
      });
    } else {
      // result = res.send(JSON.stringify({ error: 'Reset hash not found in database.' }));
      return res.status(400).json({
        errors: [{ msg: 'Reset hash not found in database!' }],
      });
    }
  } catch (err) {
    result = res.send(JSON.stringify({ error: 'There was an error connecting to the database.' }));
    return res.status(500).json({
      errors: [{ msg: 'There was an error connecting to the database.!' }],
    });
  }
  // return result;
});

module.exports = router;
