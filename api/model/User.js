let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
});


module.exports = mongoose.model("User", userSchema);