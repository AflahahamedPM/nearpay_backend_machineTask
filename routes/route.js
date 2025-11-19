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

const router = express.Router();

//  auth
router.post("/register", createUser);
router.post("/login", userLogin);

// category
router.get("/categories", verifyAuthTokenForApiRequest, getAllCategories);
router.post("/category/create", verifyAuthTokenForApiRequest, createCategory);
router.post("/category/update", verifyAuthTokenForApiRequest, updateCategory);
router.post("/category/delete", verifyAuthTokenForApiRequest, deletCategory);

module.exports = router;
