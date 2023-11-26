var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { getId, getUser } = require("../services/signupService");

const createToken = (payload) => {
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

async function protect(req, res, next) {
  let token;
  if (!req.headers.authorization) {
    return res
      .status(401)
      .send("You are not logged in, please login and try again...");
  }
  token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  // console.log(decoded.userId);

    const currentUser = await getUser(decoded.userId[0].id);
    // console.log(currentUser);
    req.user = currentUser[0];
    if (!currentUser) {
      return res
        .status(401)
        .send("the user that belong to this token does no longer exist");
    }
    next();
  } catch (error) {
    console.log(error);
    if (
      error.name == "TokenExpiredError" ||
      error.name == "JsonWebTokenError"
    ) {
      return res.status(403).json({ error: "please login" });
    }
    return res.status(500).json({ error: "faild process" });
  }
}
const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ msg: "can not access this route" });
    }
    next();
  };
module.exports = { protect, allowedTo };
