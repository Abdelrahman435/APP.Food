var express = require("express");
var router = express.Router();
const dishes = require("../controllers/dishesController");
const { protect } = require("../middlewares/protect");

router.use(protect);

router.get("/topRated", dishes.showTopDishes);
router.get("/classification/:category", dishes.classificationOfDishes);
router.get("/topSeller", dishes.topSeller);
router.get("/search", dishes.search);
router.get("/product/:id", dishes.productDetails);

module.exports = router;
