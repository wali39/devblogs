const router = require("express").Router();
const userControl = require("../controller/userControl");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

const {
  authentication,
  secureAuthentication,
} = require("../authentication/auth");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-images",
    format: async (req, file) => {
      "png", "jpg", "jpeg", "gif";
    },
    public_id: (req, file) => {
      return new Date().now() + file.originalname;
    },
  },
});
const upload = multer({ storage: storage }).single("myImage");

// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: "./public/images/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// Init Upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("myImage");

// Check File Type

// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

router.get("/register", userControl.register);

router.post("/register", upload, userControl.registrationSave);

// login code
router.get("/login", userControl.login);

router.get("/logout", userControl.logout);

router.post("/login", userControl.loginCheck);

router.get("/profile", secureAuthentication, userControl.profile);

router.get("/authorprofile/:author", userControl.authorProfileAndBlog);

router.get("/update-profile/:id", userControl.profileUpdateInitialize);
router.post("/update-profile/:id", upload, userControl.profileUpdate);

module.exports = router;
