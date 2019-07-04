const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600
  }
});

module.exports = OPT = mongoose.model("otp", OTPSchema);
