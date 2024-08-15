const { check, validationResult } = require("express-validator");

const registrationValidationRules = [
  check("email").isEmail().withMessage("Please enter a valid password"),

  // validate password */
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at greater than 8"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array() || errors.message,
      });
    }
    next();
  },
];

module.exports = registrationValidationRules;
