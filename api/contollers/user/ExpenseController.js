const mongoose = require("mongoose");
const UtilController = require("../services/UtilController");
const Budget = require("../../model/Budget");
const { returnCode } = require("../../../config/responseCode");

module.exports = {
  getAllExpenses: async (req, res, next) => {
    try {
      const userId = req?.user?.userId;

      const { month } = req?.body;

      const {
        startOfMonth,
        endOfMonth,
      } = await UtilController.getStartAndEndOfMoth(month);
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const budgetResult = await Budget.aggregate([
        {
          $match: {
            userId: userObjectId,
            startDate: { $lte: startOfMonth },
            endDate: { $gte: endOfMonth },
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { categoryId: "$categoryId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$categoryId"] },
                      { $eq: ["$active", true] },
                    ],
                  },
                },
              },
            ],
            as: "categoryDetails",
          },
        },
        {
          $unwind: "$categoryDetails",
        },
        {
          $project: {
            _id: 1,
            categoryId: 1,
            maxBudget: 1,
            spendAmount: 1,
            categoryDetails: {
              _id: 1,
              name: 1,
              color: 1,
            },
          },
        },
      ]);

      return UtilController.sendSuccess(req, res, next, {
        message: "Budgets fetched successfully",
        result: budgetResult,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, error);
    }
  },

  createExpenses: async (req, res, next) => {
    try {
      const { userId } = req?.user;
      const updateObj = req?.body || {};

      const {
        startOfMonth,
        endOfMonth,
      } = await UtilController.getStartAndEndOfMoth(updateObj?.date);

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const categoryObjectId = new mongoose.Types.ObjectId(
        updateObj?.categoryId
      );

      const budgets = await Budget.find({
        userId: userObjectId,
        startDate: { $lte: startOfMonth },
        endDate: { $gte: endOfMonth },
        categoryId: categoryObjectId,
      })
        .limit(1)
        .lean();

      const budgetDoc = budgets && budgets.length ? budgets[0] : null;

      if (!budgetDoc) {
        return UtilController.sendSuccess(req, res, next, {
          message: "No budget found for this category/month",
          responseCode: returnCode.invalidSession,
        });
      }

      const incomingSpend = Number(updateObj?.spendAmount || 0);
      const prevSpend = Number(budgetDoc.spendAmount || 0);
      const maxBudget = Number(budgetDoc.maxBudget || 0);

      const newSpend = prevSpend + incomingSpend;
      const newRemaining = maxBudget - newSpend;

      const updated = await Budget.findByIdAndUpdate(
        budgetDoc._id,
        {
          $set: {
            spendAmount: newSpend,
            remainingAmount: newRemaining,
          },
        },
        { new: true }
      ).lean();

      return UtilController.sendSuccess(req, res, next, {
        message: "Expense applied and budget updated",
        result: updated,
      });
    } catch (error) {
      console.error("createExpenses error:", error);
      return UtilController.sendError(req, res, next, error);
    }
  },
};
