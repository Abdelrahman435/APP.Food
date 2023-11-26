const express = require("express");
const {
  Cart,
  addItemCart,
  deleteItemCart,
  updateItemCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/protect");
const {
  updateCartValidation, addItemValidation,
} = require("../validation/cartValidation");
const router = express.Router();
router.use(protect);
router.get("", Cart);

router.route("/item/:dishId").post(addItemValidation, addItemCart);
router.route("/cartitem/:id").delete(deleteItemCart).put(updateCartValidation,updateItemCart);

module.exports = router;
