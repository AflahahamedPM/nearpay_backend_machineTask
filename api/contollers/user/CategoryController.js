const { returnCode } = require("../../../config/responseCode");
const Category = require("../../model/Category");
const UtilController = require("../services/UtilController");

module.exports = {
  getAllCategories: async (req, res, next) => {
    try {
      const { userId } = req?.user;

      const categories = await Category.find({ userId: userId, active: true })
        .select("_id name color")
        .lean();

      UtilController.sendSuccess(req, res, next, {
        message: "Categories fetched successfully",
        result: categories,
      });
    } catch (error) {
      console.log(error, "Error in fetch categories");

      UtilController.sendError(req, res, next, error);
    }
  },

  createCategory: async (req, res, next) => {
    try {
      const { userId } = req?.user;

      const createObj = req?.body;

      createObj["userId"] = userId;

      await Category.create(createObj);

      UtilController.sendSuccess(req, res, next, {
        message: "Category created successfully",
        responseCode: returnCode?.validSession,
      });
    } catch (error) {
      console.log(error, "Error in creating categories");
      UtilController.sendError(req, res, next, error);
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const updateObj = req?.body;

      await Category.findByIdAndUpdate(
        updateObj._id,
        { $set: { ...updateObj } },
        { new: true }
      );

      UtilController.sendSuccess(req, res, next, {
        message: "Category updated successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "Error in updating categories");
      UtilController.sendError(req, res, next, error);
    }
  },

  deletCategory: async (req, res, next) => {
    try {
      const { recordId } = req?.body;
      await Category.findByIdAndUpdate(
        recordId,
        { $set: { active: false } },
        { new: true }
      );
      UtilController.sendSuccess(req, res, next, {
        message: "Category deleted successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      console.log(error, "Error in deleting categories");
      UtilController.sendError(req, res, next, error);
    }
  },
};
