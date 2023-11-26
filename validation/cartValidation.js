const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validationMiddleware");
exports.addItemValidation = [
  check("quantity")
    .notEmpty()
    .withMessage("quantity required")
    .isNumeric()
    .withMessage("quantity must be a number")
    .custom((value) => {
      if (value < 1) {
        throw new Error("quantity must be greater than or equal to 1");
      }
      return true;
    }),
  check("size")
    .notEmpty()
    .withMessage("size of dish required")
    .custom((value) => {
      const sizes = ["small", "medium", "large", "exlarge"];
      if (!sizes.includes(value.toLowerCase())) {
        throw new Error("size must be either small, medium, large or exlarge");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateCartValidation = [
  check("quantity")
    .notEmpty()
    .withMessage("quantity required")
    .isNumeric()
    .withMessage("quantity must be a number")
    .custom((value) => {
      if (value < 1) {
        throw new Error("quantity must be greater than or equal to 1");
      }
      return true;
    }),
  validatorMiddleware,
];
