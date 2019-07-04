const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
const crypto = require("crypto");
const router = express.Router();

// Load email service
const EmailService = require("../../config/EmailService");

// Load user model
const User = require("../../models/User");

// Load profile model
const Profile = require("../../models/Profile");

// Load OPT model
const OTP = require("../../models/OTP");

// Load Token model
const Token = require("../../models/Token");

// Load input valudation
const validateRegisterInput = require("../../validator/register");
const validateLoginInput = require("../../validator/login");
const validateOtpRequest = require("../../validator/is-otp");
const validateOtpPasswordRequest = require("../../validator/is-otp-password");

const isEmpty = require("../../validator/is-empty");
const isEmail = require("../../validator/is-email");
const isToken = require("../../validator/is-token");

//@route  Get api/users/register
//@des    Register user
//@access public
router.post("/register", (req, res) => {
  // check for errors
  const errors = validateRegisterInput(req.body);

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }

    Profile.findOne({ username: req.body.username }).then(profile => {
      if (profile) {
        return res.status(400).json({ email: "Username already exists" });
      }

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            res.status(500).json({ password: "unable to generate hash" });
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const newProfile = new Profile({
                user: user.id,
                username: req.body.username
              });

              newProfile.save().then(profile => {
                // Create a verification token for this user
                const newToken = new Token({
                  user: user.id,
                  token: crypto.randomBytes(16).toString("hex")
                });

                newToken.save(token => {
                  EmailService.sendText(
                    "mytrustcoder@gmail.com",
                    "Welcome!",
                    "Do something great!"
                  )
                    .then(() => {
                      // Email sent successfully
                      res.json({
                        username: user.username,
                        email: user.email,
                        date: user.date,
                        isVerified: user.isVerified
                      });
                    })
                    .catch(err => {
                      res.json({
                        username: user.username,
                        email: user.email,
                        date: user.date,
                        isVerified: user.isVerified
                      });
                    });
                });
              });
            })
            .catch(err => res.status(400).json(err));
        });
      });
    });
  });
});

//@route  Get api/users/login
//@des    Login user /Returing jwt token
//@access public
router.post("/login", (req, res) => {
  const errors = validateLoginInput(req.body);

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const password = req.body.password;

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(404).json({ error: "invalid email or password" });
    }

    bycrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Match
        const payload = {
          id: user.id,
          username: user.username,
          email: user.email
        };
        // Sign Token
        jwt.sign(
          payload,
          keys.secretKey,
          { expiresIn: 3600 * 3600 },
          (err, token) => {
            res.json({ sucess: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ error: "invalid email or password" });
      }
    });
  });
});

//@route  Get api/users/current
//@des    Return current user
//@access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
      date: req.user.date,
      isVerified: req.user.isVerified
    });
  }
);

//@route  GET api/users/confirmation
//@des    Confirm the account
//@access public
router.get("/confirmation", (req, res) => {
  if (!isToken(req.query.token))
    return res.send(
      "Invalid or missing token for verification" + req.query.token
    );

  Token.findOne({ token: req.query.token }, function(err, token) {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg: "We were unable to find a valid token. Your token my have expired."
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token.user }, function(err, user) {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res.status(400).send({
          type: "already-verified",
          msg: "This user has already been verified."
        });

      // Verify and save the user
      user.isVerified = true;
      user
        .save()
        .then(user => {
          res.status(200).send("The account has been verified. Please log in.");
        })
        .catch(err => res.status(500).send({ msg: err.message }));
    });
  });
});

//@route  POST api/users/resend
//@des    Request a new confirmation code
//@access public
router.post("/resend", (req, res) => {
  const email = req.body.email;

  if (!isEmail(email)) return res.status(400).json({ email: "Invalid email" });

  User.findOne({ email: email }).then(user => {
    if (!user) return res.status(400).json({ email: "Email not registered" });

    const newToken = new Token({
      user: user.id,
      token: crypto.randomBytes(32).toString("hex")
    });

    newToken.save().then(token => {
      EmailService.sendText(
        user.email,
        "Verify your account",
        "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/api/users/confirmation?token=" +
          token.token +
          ".\n"
      )
        .then(info => {
          // Email sent successfully
          ///          console.log(info);
          res.json({
            status: "success",
            message: "email sent successfully"
          });
        })
        .catch(err => {
          //          console.log(err);
          res.status(400).json({
            error: "Something went wrong ",
            message: "unable to send email"
          });
        });
    });
  });
});

//@route  POST api/request_otp
//@des    Request a new confirmation code
//@access public
router.post("/request_otp", (req, res) => {
  const email = req.body.email;

  if (!isEmail(email)) return res.status(400).json({ email: "Invalid email" });

  User.findOne({ email: email }).then(user => {
    if (!user) return res.status(400).json({ email: "Email not registered" });

    const newOtp = new OTP({
      email: user.email,
      token: Math.floor(100000 + Math.random() * 900000)
    });

    newOtp.save().then(otp => {
      EmailService.sendText(
        user.email,
        "Password Reset",
        "Your verification code is " + otp.token
      )
        .then(info => {
          // Email sent successfully
          //          console.log(info);
          res.json({
            status: "success",
            message: "OTP sent on email."
          });
        })
        .catch(err => {
          //          console.log(err);
          res.status(500).json({
            error: "something went wrong",
            message: "Field to send token on email "
          });
        });
    });
  });
});

//@route  POST api/users/validate_otp
//@des    Validates an OTP
//@access public
router.post("/validate_otp", (req, res) => {
  const errors = validateOtpRequest(req.body);

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  OTP.findOne({
    $and: [{ email: req.body.email }, { token: req.body.otp }]
  })
    .then(otp => {
      if (!otp) {
        return res.status(404).json({ otp: "Invalid OTP" });
      }

      if (otp.isValid) {
        return res.json({
          status: "success",
          message: "OTP is validated, now you can reset password"
        });
      }
      return res.status(404).json({
        otp: "Invalid OTP, already used."
      });
    })
    .catch(err => res.status(400).json(err));
});

//@route  POST api/users/password/reset
//@des    Request a new confirmation code
//@access public
router.post("/reset_password", (req, res) => {
  const errors = validateOtpPasswordRequest(req.body);

  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  OTP.findOne({
    $and: [{ email: req.body.email }, { token: req.body.otp }]
  }).then(otp => {
    if (!otp) {
      return res.status(404).json({ otp: "Invalid OTP" });
    }
    if (!otp.isValid) {
      return res.status(404).json({ otp: "Invalid OTP, already used" });
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.status(404).json({
          error: "something went wrong",
          message: "email not registered"
        });
      }
      otp.isValid = false;
      otp.save();

      bycrypt.genSalt(10, (err, salt) => {
        bycrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            res.status(500).json({ password: "unable to generate hash" });
          }
          user.password = hash;
          user.save().then(user =>
            res.json({
              status: "success",
              message: "Password is successfully updated."
            })
          );
        });
      });
    });
  });
});

module.exports = router;
