const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  token: String,
  hash: String,
  salt: String,
  characters: Array,
  comics: Array,
});
module.exports = User;
