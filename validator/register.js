const Validator = require("validator");
const isEmpty = require("./is-empty");
// Load user model
const User = require("../models/User");

module.exports = function validateRegisterInput(data) {
  let erorrs = {};

  data.username = isEmpty(data.username) ? "" : data.username;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.confirm_password = isEmpty(data.confirm_password)
    ? ""
    : data.confirm_password;

  if (Validator.isEmpty(data.username)) {
    erorrs.username = "Username is required";
  } else if (!Validator.isLength(data.username, { min: 5, max: 12 })) {
    erorrs.username = "username must be between 5 and 12 characters";
  } else if (!Validator.isAlphanumeric(data.username)) {
    erorrs.username = "username must be alpha numeric only";
  }

  if (Validator.isEmpty(data.email)) {
    erorrs.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    erorrs.email = "Inalid Email";
  }

  if (Validator.isEmpty(data.password)) {
    erorrs.password = "Password is required";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    erorrs.password = "Password must be at least 6";
  }

  if (Validator.isEmpty(data.confirm_password)) {
    erorrs.confirm_password = "Confirm Password is required";
  } else if (!Validator.equals(data.password, data.confirm_password)) {
    erorrs.confirm_password = "Password must match";
  }

  return erorrs;
};
