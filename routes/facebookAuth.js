const router = require("express").Router();
const passport = require('passport');

router.get("/", passport.authenticate("facebook"));


router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/users/signupFacebook",
    failureRedirect: "http://localhost:3000/facebook/login/failed",
  })
);

router.get("/login/success", (req, res) => {
  if(req.user){
    res.status(200).json({
        error: false,
        message: "success",
        data: req.user
    })
  }
  else{
    res.status(401).json({
        error: false,
        message: "auth error",
    })
  }

});

router.get("/login/failed", (req,res)=>{
    res.status(401).json({
        error: true,
        message: "log in failure",
    })
});


module.exports = router;