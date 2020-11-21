const mongoose = require("mongoose");
// require("dotenv").config();
const url =
  "mongodb+srv://wali39:databasemdb@cluster0.6mjw9.mongodb.net/myDatabase?retryWrites=true&w=majority";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
