const express = require("express");

const {
  authentication,
  secureAuthentication,
} = require("../authentication/auth");

const blogControl = require("../controller/blogControl");
const Blog = require("../models/blog");
const router = express.Router();

router.use(function (req, res, next) {
  res.locals.user = req.user || null;

  next();
});

router.get("/blogs/:page", blogControl.showBlogs);

router.post("/addblogs", blogControl.blogSave);

router.get("/details/:id", blogControl.detailsBlog);

// // Create a Comment
router.post("/details/:id", blogControl.createComment);

router.get("/delete/:id", blogControl.deleteBlog);

router.get("/blog-create", secureAuthentication, blogControl.createBlog);

router.get("/edit/:id", blogControl.editBlog);

router.post("/edit/:id", blogControl.editedBlogSave);
router.get("/search", (req, res, next) => {
  let { term } = req.query;
  const perPage = 6;

  const regx = new RegExp(term, "i");

  Blog.find({ title: regx })
  .exec(function (err, blogs) {
    Blog.count().exec(function (err, count) {
      if (err) next(err);
      res.render("index", {
        blogs,
        title: "searching blog",
        admin: false,
        pages: Math.ceil(count / perPage),
        current: 1,
      });
    });
  });

  // Blog.find({
  //   title: regx,
  // })
  //   .then((result) => {
  //     res.render("index", {
  //       blogs: result,
  //       title: "searching blog",
  //       admin: false,
  //       pages: 1,
  //       current: 1,
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
});

module.exports = router;
