const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  maxBudget: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
  },
  endDate: {
    type: Number,
    default: Math.floor(Date.now() / 1000),
  },
  spendAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
