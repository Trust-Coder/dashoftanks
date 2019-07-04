const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRandomProfileInput(data) {
  let errors = {};

  //  data.rank = isEmpty(data.rank) ? "" : data.rank;
  data.amount = isEmpty(data.amount) ? "" : data.amount;

  if (isEmpty(data.filters)) {
    errors.rank = "Filters are required";
  }
  if (
    typeof data.amount === "string" &&
    !Validator.isInt(data.amount, { min: 1 })
  ) {
    errors.amount = "Amount must be a numeric value greator than 0";
  } else if (typeof data.amount === "number" && data.amount <= 0) {
    errors.amount = "Amount must be a numeric value greator than 0";
  }

  return errors;
};
