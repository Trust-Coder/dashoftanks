const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateOtpRequest(data) {
  let erorrs = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.otp = isEmpty(data.otp) ? "" : data.otp;

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

  return erorrs;
};
