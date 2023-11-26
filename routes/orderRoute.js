const express = require("express");
const {
  createCashOrder,
  updateOrderToDelivered,
  checkoutSession,
  getOrdersUser,
  getSpecificOrder,
  cancelOrders,
  updateOrderToShipped,
} = require("../controllers/orderController");
const { protect, allowedTo } = require("../middlewares/protect");
const router = express.Router();
router.use(protect);
router.get("", getOrdersUser);
router.post("/checkout-session/:cartId", checkoutSession);

router
  .route("/:cartId")
  .post(createCashOrder)
  .get(getSpecificOrder)
  .delete(cancelOrders);

router.put(
  "/:id/deliver",
  allowedTo("ADMIN", "DELIVERY"),
  updateOrderToDelivered,
);

router.put("/:id/shipped", allowedTo("ADMIN"), updateOrderToShipped);

module.exports = router;
