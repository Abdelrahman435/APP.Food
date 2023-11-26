var express = require("express");
var router = express.Router();
const { validate } = require("../validation/signup_validation");
const { validate2 } = require("../validation/login_validation");
const { verifyUser } = require("../controllers/verifyController");
const {
  resetPassOTP,
  changePass,
} = require("../controllers/forgotPasswordController");
const { protect } = require("../middlewares/protect");
const {
  login,
  facebookLogin,
  gmailLogin,
} = require("../controllers/loginController");
const {
  postSignup,
  postSignupGmail,
  postSignupFacebook,
  resendOTP,
  signUpGmail,
} = require("../controllers/signupController");
const {
  addFavController,
  removeFavController,
  getFavController,
} = require("../controllers/favController");

// router.use(,protect);

router.post("/signup", validate(), postSignup);
router.post("/verify", verifyUser);
router.post("/login", validate2(), login);
router.post("/resendOTP", resendOTP);
router.post("/resetPassOTP", resetPassOTP);
router.post("/resetPassVerify", changePass);
router.get("/signupGmail", signUpGmail);
router.get("/gmail", postSignupGmail);
router.get("/google", gmailLogin);
router.get("/signupFacebook", postSignupFacebook);
router.get("/loginFacebook", facebookLogin);
router.post("/favorites/add", protect, addFavController);
router.delete("/favorites/delete", protect, removeFavController);
router.get("/favorites", protect, getFavController);

module.exports = router;
