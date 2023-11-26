const { body, validationResult } = require('express-validator');

function validate() {
  // console.log('flag');
  try {
    return [
      body("fullname")
        .isString()
        .isLength({ min: 3, max: 20 })
        .withMessage('Please enter a valid first name'),

      body("email")
        .isEmail()
        .withMessage('Please enter a valid email'),

      body("password"),

      body("phone"),
        

      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        next();
      }
    ]
  } catch (error) {
    console.log(error);
  }
}

module.exports = { validate };