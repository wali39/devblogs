const mongoose = require("mongoose");

const comment_schema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: "Content is Required",
    },
    commentCreator: String,
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: "Blog is Required Field",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", comment_schema);
