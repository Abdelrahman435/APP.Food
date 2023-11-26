var express = require("express");
var router = express.Router();
const notificationControllers = require("../controllers/notificationControllers");
const { protect } = require("../middlewares/protect");

router.use(protect);

router.get("/:id", notificationControllers.notification);

module.exports = router;
