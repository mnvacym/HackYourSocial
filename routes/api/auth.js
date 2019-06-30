const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const Sgmail = require('@sendgrid/mail');
Sgmail.setApiKey(config.get('sendgrid'));

// @route   GET api/auth
// @desc    Gets the authorized user
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verifyToken');
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
      res.status(500).send('Server error');
    }
  }
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
    try {
      // check and make sure the email exists
      const foundUser = await User.findOne({ email: req.body.email });

      // configure jsonwebtoken for expiring reset request
      const timeInMs = Date.now();
      const hashString = `${foundUser.id}${timeInMs}`;
      const payload = {
        token: {
          value: hashString,
        },
      };

      foundUser.passwordReset = jwt.sign(payload, config.get('passwordChangeSecret'), {
        expiresIn: 1800,
      });
      foundUser.save();

      const message = {
        to: foundUser.email, //email variable
        from: 'hyfproject19@gmail.com',
        subject: 'Reset Your Password',
        html: `
        <style>
        .navbar {
          padding: 0.7rem 2rem;
          width: 100%;
          border-bottom: solid 1px #33383e;
          opacity: 0.9;
          color: #fff;
          }
        .bg-dark{
            background: #363b3f;
            color: #fff;
          }
        a {
              text-decoration: none;
          }
        p {
              font-size: 1.5rem;
              margin-bottom: 1rem;
          }
        body{
            margin:0;
            padding:0;
            max-width:800px;
            text-align:center;
          }
        .btn {
            display: inline-block;
            color: #333;
            padding: 0.4rem 1.3rem;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            margin-right: 0.5rem;
            transition: opacity 0.2s ease-in;
            outline: none;
        }
          .btn-primary {
            background: #17a2b8;
            color: #fff;
        }
        </style>
        <script src="https://kit.fontawesome.com/2226fc3df0.js"></script>
        <body>
        <div class="navbar bg-dark"><h1><i class="fas fa-code" aria-hidden="true"></i>HackYourSocial</div>
        <h2>Hi ${foundUser.name},</h2>
        <p>We've received a request to reset your password. Click the button below to reset it</p>  
        <form action="http://localhost:3000/auth/change-password/${foundUser.passwordReset}">
          <input class="btn btn-primary" type="submit" value="Reset My Password" />
        </form>
        <p>If you didn't make the request please ignore this email, or reply to let us know. This password reset is valid only for next 30 minutes</p>
        <p>If you're having trouble with clicking the password reset button, copy and paste the URL below into your web browser.</p> <a href="http://localhost:3000/auth/change-password/${
          foundUser.passwordReset
        }" target="_blank">http://localhost:3000/auth/change-password/${
          foundUser.passwordReset
        }</a></p>
        <p>Thanks,</p>
        <p>Hack Your Social Team</p>
        </body>
        `,
      };

      Sgmail.send(message);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({
        errors: [
          {
            msg: 'Something went wrong while attempting to reset your password. Please Try again!',
          },
        ],
      });
    }
  }
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

    try {
      const { password, hash: passwordReset } = req.body;

      jwt.verify(passwordReset, config.get('passwordChangeSecret'), err => {
        if (err) {
          return res.status(400).json({
            errors: [{ msg: 'Request is not valid, Please Try again!' }],
          });
        }
      });

      // look up user in the DB based on reset hash
      const foundUser = await User.findOne({ passwordReset });

      // If the user exists save their new password
      if (foundUser) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        foundUser.password = newPassword;
        foundUser.passwordReset = '';
        foundUser.save();

        result = res.send(JSON.stringify({ success: true }));
      } else {
        return res.status(400).json({
          errors: [{ msg: 'Request is not valid, Please Try again!' }],
        });
      }
    } catch (err) {
      res.status(500).json({
        errors: [{ msg: 'Something went wrong while saving your password. Please Try again!' }],
      });
    }
  }
);

module.exports = router;
