const express = require("express");
const {
  userLogin,
  createUser,
} = require("../api/contollers/user/AuthController.js");
const {
  verifyAuthTokenForApiRequest,
} = require("../api/contollers/services/TokenController.js");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deletCategory,
} = require("../api/contollers/user/CategoryController.js");
const {
  getBudgetDatas,
  updateBuget,
  createBudget,
} = require("../api/contollers/user/BudgetController.js");
const { getAllExpenses, createExpenses } = require("../api/contollers/user/ExpenseController.js");

const router = express.Router();

//  auth
router.post("/register", createUser);
router.post("/login", userLogin);

// category
router.get("/categories", verifyAuthTokenForApiRequest, getAllCategories);
router.post("/category/create", verifyAuthTokenForApiRequest, createCategory);
router.post("/category/update", verifyAuthTokenForApiRequest, updateCategory);
router.post("/category/delete", verifyAuthTokenForApiRequest, deletCategory);

// budgets
router.post("/budgets", verifyAuthTokenForApiRequest, getBudgetDatas);
router.post("/budgets/update", verifyAuthTokenForApiRequest, updateBuget);
router.post("/budget/create",verifyAuthTokenForApiRequest, createBudget);

// expenses 
router.post("/expenses", verifyAuthTokenForApiRequest, getAllExpenses);
router.post("/expense/create", verifyAuthTokenForApiRequest, createExpenses)

module.exports = router;
