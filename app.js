const express = require("express");
const ejs = require("ejs");
require("./db/mongoose");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const blogRoute = require("./router/blogRoute");
const userRoute = require("./router/userRoute");
const flash = require("connect-flash");
const Blog = require("./models/blog");
const app = express();
const User = require("./models/user");
app.set("view engine", "ejs");
// app.set("views", "./views");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));

// for passport and passport local

app.use(session({ secret: "magic", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.file = null;

  if (req.file) {
    res.locals.file = `/images/${req.file.filename}`;
  }

  next();
});

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  next();
});

app.use(blogRoute);

app.use(userRoute);

// root directory redirect to blog directory
app.get("/", (req, res) => {
  res.redirect("/blogs");
});
app.get("/about", (req, res) => {
  res.render("contact", {
    title: "About Us",
  });
});

app.use((req, res) => {
  res.render("404", {
    title: "404",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("Server started on port " + port);
});
