const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { boolean, string } = require("yargs");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  image: String,
  details: String,
  work: String,

  admin: {
    type: Boolean,
    default: false,
  },
}).pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
