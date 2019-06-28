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

const sendEmail = user => {
  const verificationEmail = {
    to: user.email, //email variable
    from: 'hyfproject19@gmail.com',
    subject: 'Confirm Your Account | Hack Your Social',
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
    a { text-decoration: none; }
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
    <h2>Hi ${user.name},</h2>
    <p>You've just created your Hack Your Social account. You just need to confirm your account to go on. Just click the button below :)</p>  
    <form action="http://localhost:3000/user/verification/${user.verificationHash}">
      <input class="btn btn-primary" type="submit" value="Verify The Account" />
    </form>
    <p>If you're having trouble with clicking the verify the account, copy and paste the URL below into your web browser.</p>
      <a
        href="http://localhost:3000/user/verification/${user.verificationHash}" 
        target="_blank">http://localhost:3000/user/verification/${user.verificationHash}
      </a>
    </p>
    <p>Thanks,</p>
    <p>Hack Your Social Team</p>
    </body>
    `,
  };

  Sgmail.send(verificationEmail);

  res.status(200).json({ success: true });
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

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Verification hash
      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '10h' }, async (err, token) => {
        if (err) throw err;

        user.verificationHash = token;
        sendEmail(user);
      });

      await user.save();

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

// User Verification
router.get('/verification/:token', (req, res) => {
  try {
    const user = User.findOne({ verificationHash: req.params.token });

    if (!user.verificationHash)
      return res.status(400).json({ errors: [{ msg: 'Invalid token!' }] });

    if (user.isVerified) {
      return res.status(400).json({ errors: [{ msg: 'User already verified!' }] });
    } else {
      User.findOneAndUpdate(
        { verificationHash: req.params.token },
        {
          $set: {
            isVerified: true,
            verificationHash: null,
          },
        },
      );
    }

    user.save(err => {
      if (err) return res.status(500).json({ errors: [{ msg: err.message }] });
      res.status(200).json({ msg: 'User is verified!' });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error!');
  }
});

module.exports = router;
