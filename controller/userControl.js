const User = require("../models/user");
const Blog = require("../models/blog");
const passport = require("passport");
// const { use } = require("passport");

const register = (req, res) => {
  res.render("register", {
    title: "Register",
  });
};

const registrationSave = (req, res) => {
  const user = new User(req.body);
  if (req.file) {
    user.image = req.file.filename;
  }

  const f = /\S+@\S+\.\S+/;

  if (!user.email || !user.name || !user.password) {
    var err = "please fill all the field...";
    res.render("register", {
      err,
      title: "Register",
    });
  } else if (user.password.length < 6) {
    var err = "minimum password length 6...";
    res.render("register", {
      err,
      title: "Register",
    });
  } else if (User.find({ name: user.name }).length > 1) {
    var err = "This Username already taken please try another ...";
    console.log(user.name);
    res.render("register", {
      err,
      title: "Register",
    });
  } else if (!f.test(user.email)) {
    var err = "email is invalid...";
    res.render("register", {
      err,
      title: "Register",
    });
  } else {
    user
      .save()
      .then((result) => {
        req.flash("success_message", "registered success..");
        res.redirect("/login");
      })
      .catch((err) => {
        var err = "user exists! username and email must be unique";
        res.render("register", {
          err,
          title: "Register",
        });
        // console.log(err);
      });
  }
};

const login = (req, res) => {
  res.render("login", {
    title: "login",
  });
};

const logout = (req, res) => {
  req.logOut();
  res.redirect("/");
};

const loginCheck = async (req, res, next) => {
  try {
    res.locals.userCheck = 1;
    await passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/profile",
      failureFlash: true,
    })(req, res, next);
  } catch (error) {
    res.redirect("404");
  }
};

const profile = (req, res) => {
  res.render("profile", {
    user: req.user,
    title: "Profile",
  });
};

const authorProfileAndBlog = async (req, res) => {
  const author = req.params.author;
  const user1 = res.locals.user;
  var admin = false;
  if (user1 && user1.admin === true) {
    admin = true;
  }
  if (user1 && author === user1.name) {
    admin = true;
  }
  var user = await User.findOne({ name: author })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(user);
  await Blog.find({ author })
    .then((result) => {
      res.render("blogandprofile", {
        title: "author profile",
        author,
        admin,
        writer: user,
        file: res.locals.file,
        blogs: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const profileUpdate = async (req, res) => {
  const id = req.params.id;
  const user = {};
  if (req.file) {
    user.image = req.file.filename;
  }
  user.work = req.body.work;
  user.details = req.body.about;

  User.findByIdAndUpdate(id, user)
    .then((result) => {
      res.redirect("/profile");
    })
    .catch((err) => {
      console.log(err);
    });
};
const profileUpdateInitialize = (req, res) => {
  const author = req.params.id;
  res.render("update-profile", { title: "update profile" });
};
module.exports = {
  register,
  registrationSave,
  login,
  logout,
  loginCheck,
  profile,
  authorProfileAndBlog,
  profileUpdate,
  profileUpdateInitialize,
};
