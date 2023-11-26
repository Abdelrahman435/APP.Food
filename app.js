var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const cookieSession = require("cookie-session");
const cors = require("cors");
require("dotenv").config();
const passportSetup = require("./passport");
var bodyParser = require("body-parser");
// Routes
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
const auth = require("./routes/auth");
const facebook = require("./routes/facebookAuth");
var orderRouter = require("./routes/orderRoute");
const cartRouter = require("./routes/cartRoutes");
const notification = require("./routes/notificationRouter");
const editRouter = require("./routes/editProfileRouter");
const historyRouter = require("./routes/historyRouter");
const dishes = require("./routes/dishesRouter");

//express
var app = express();
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// webhook payment
const { webhookCheckout } = require("./controllers/orderController");
app.post(
  "/webhook-checkout",
  bodyParser.raw({ type: "application/json" }),
  webhookCheckout,
);

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  }),
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", auth); //http://localhost:3000/auth/google
app.use("/facebook", facebook);
app.use("/orders", orderRouter);
app.use("/cart", cartRouter);
app.use("/notification", notification);
app.use("/edit", editRouter);
app.use("/history", historyRouter);
app.use("/dishes", dishes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
//app file
