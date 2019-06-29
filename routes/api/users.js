const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const Sgmail = require('@sendgrid/mail');
Sgmail.setApiKey(config.get('sendgrid'));

const User = require('../../models/User');

//delete this route -- only for test
router.post('/reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  user.isVerified = false;
  await user.save();
  res.status(200).json({ success: true });
});

// send verification email
const sendVerificationToken = async user => {
  // configure jsonwebtoken for expiring reset request

  const timeInMs = Date.now();
  const hashString = `${user.id}${timeInMs}`;

  const payload = {
    token: {
      value: hashString,
    },
  };

  user.verifyToken = jwt.sign(payload, config.get('verificationSecret'), { expiresIn: 1800 });
  await user.save();

  // send email

  const message = {
    to: user.email, //email variable
    from: 'hyfproject19@gmail.com',
    subject: 'Verify Your Account',
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
        background: #fa7c3c;
        color: #fff;
    }
    </style>
    <body>
    <div class="navbar bg-dark"><h1><i class="fas fa-code" aria-hidden="true"></i>HackYourSocial</div>
    <h2>Hi ${user.name},</h2>
    <p>Welcome to HackYourSocial!</p>
    <p>You're almost ready to start enjoying HackYourSocial</p>
    <p>Simply click the big orange button below to verify your e-mail address</p>  
    <form action="http://localhost:3000/users/verify/${user.verifyToken}">
      <input class="btn btn-primary" type="submit" value="Verify My E-mail" />
    </form>
    <p>If you're having trouble with clicking the verify e-mail button, copy and paste the URL below into your web browser.</p> <a href="http://localhost:3000/users/verify/${
      user.verifyToken
    }" target="_blank">http://localhost:3000/users/verify/${user.verifyToken}</a></p>
    <p>Thanks,</p>
    <p>Hack Your Social Team</p>
    </body>
    `,
  };

  Sgmail.send(message);
};

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Please enter a password with 6 or more characters!').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //confirmation email -- to be a function

      await sendVerificationToken(user);

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

// @route   POST api/users/verify
// @desc    user confirmation
// @access  Public
router.post(
  '/verify',
  [
    check('verifyToken', 'verifyToken is required!')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { verifyToken } = req.body;

    try {
      jwt.verify(verifyToken, config.get('verificationSecret'));

      const user = await User.findOne({ verifyToken });

      user.isVerified = true;
      user.verifyToken = '';
      await user.save();

      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      if (err.name === 'TokenExpiredError') {
        return res.status(500).json({
          errors: [{ msg: 'Request is not valid, Please Try again!' }],
        });
      }
      res.status(500).json({
        errors: [{ msg: 'Something went wrong while saving your password. Please Try again!' }],
      });
    }
  }
);

// @route   POST api/users/resendconfirmation
// @desc    resend confirmation
// @access  Public
router.post(
  '/resendconfirmation',
  [check('email', 'Please include a valid email!').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      user = await User.findOne({ email });

      if (user.isVerified) {
        return res.status(400).json({ errors: [{ msg: 'This user has already verified' }] });
      }

      await sendVerificationToken(user);
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: [{ msg: 'Something went wrong while saving your password. Please Try again!' }],
      });
    }
  }
);

module.exports = router;
