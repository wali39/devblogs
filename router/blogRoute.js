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

router.get("/blogs", blogControl.showBlogs);

router.post("/addblogs", blogControl.blogSave);

router.get("/details/:id", blogControl.detailsBlog);

// // Create a Comment
router.post("/details/:id", blogControl.createComment);

router.get("/delete/:id", blogControl.deleteBlog);

router.get("/blog-create", secureAuthentication, blogControl.createBlog);

router.get("/edit/:id", blogControl.editBlog);

router.post("/edit/:id", blogControl.editedBlogSave);
router.get("/search", (req, res) => {
  let { term } = req.query;

  // Make lowercase
  // term = term.toLowerCase();
  const regx = new RegExp(term, "i");
  Blog.find({
    title: regx,
  })
    .then((result) => {
      res.render("index", {
        blogs: result,
        title: "searching blog",
        admin: false,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
