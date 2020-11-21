const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const authentication = function () {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, function (
      email,
      password,
      done
    ) {
      User.findOne({ email: email }, async function (error, user) {
        if (error) {
          return done(error);
        }
        if (!user) {
          console.log("Email not registered.");
          return done(null, false, { message: "User Doesn't Exits.." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log("Password did not match.");
          return done(null, false, { message: "Password Doesn't Match.." });
        }

        return done(null, user);
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

const secureAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};

module.exports = authentication();
module.exports = { secureAuthentication };
