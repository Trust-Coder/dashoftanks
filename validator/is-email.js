const Validator = require("validator");
const isEmpty = require("./is-empty");

const isEmail = value => !isEmpty(value) && Validator.isEmail(value);

module.exports = isEmail;
