const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateOtpPasswordRequest(data) {
  let erorrs = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.otp = isEmpty(data.otp) ? "" : data.otp;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.confirm_password = isEmpty(data.confirm_password)
    ? ""
    : data.confirm_password;

  if (Validator.isEmpty(data.email)) {
    erorrs.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    erorrs.email = "Invalid Email";
  }

  if (Validator.isEmpty(data.otp)) {
    erorrs.otp = "OTP is required";
  } else if (!Validator.isLength(data.otp, { min: 6, max: 6 })) {
    erorrs.otp = "Invalid OTP";
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
