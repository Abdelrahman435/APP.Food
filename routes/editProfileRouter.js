var express = require('express');
var router = express.Router();
const upload = require("../middlewares/uploadFiles")
const editProfile = require("../controllers/editProfileController")
const { protect } = require("../middlewares/protect");

router.use(protect);

router.patch('/:id' ,upload.single("image"), editProfile.editProfile)

module.exports = router