const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Categories", categorySchema);
