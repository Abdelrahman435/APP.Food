var express = require("express");
var router = express.Router();
const history = require("../controllers/historyController");
const { protect } = require("../middlewares/protect");

router.use(protect);

router.get("/:userId", history.historOrders);

module.exports = router;
