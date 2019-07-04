const Validator = require("validator");
const isEmpty = require("./is-empty");

const isToken = value =>
  !isEmpty(value) && Validator.isLength(value, { min: 64, max: 64 });

module.exports = isToken;
