const Validator = require("validator");
const isEmpty = require("./is-empty");
// Load user model
const User = require("../models/User");

module.exports = function validateLoginInput(data) {
  let erorrs = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  if (Validator.isEmpty(data.email)) {
    erorrs.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    erorrs.email = "Invalid Email";
  }

  if (Validator.isEmpty(data.password)) {
    erorrs.password = "Password is required";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    erorrs.password = "Password must be at least 6";
  }

  return erorrs;
};
