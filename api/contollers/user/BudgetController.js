const mongoose = require("mongoose");
const Budget = require("../../model/Budget");
const UtilController = require("../services/UtilController");
const { returnCode } = require("../../../config/responseCode");

module.exports = {
  getBudgetDatas: async (req, res, next) => {
    try {
      const userId = req?.user?.userId;
      const { month } = req?.body;
      console.log(month,"month in getBudget api");
      

      const {
        startOfMonth,
        endOfMonth,
      } = await UtilController.getStartAndEndOfMoth(month);

      console.log(
        startOfMonth,
        endOfMonth,
        "start and end of month in get expense api"
      );

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
                      { $eq: ["$active", true] }, // only active categories
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
      console.error("getBudgetDatas error:", error);
      UtilController.sendError(req, res, next, error);
    }
  },

  updateBuget: async (req, res, next) => {
    try {
      const { updates } = req?.body;

      await Promise.all(
        updates.map((data) =>
          Budget.updateOne({ _id: data._id }, [
            {
              $set: {
                maxBudget: Number(data.maxBudget) || 0,
                remainingAmount: {
                  $subtract: [Number(data.maxBudget) || 0, "$spendAmount"],
                },
              },
            },
          ])
        )
      );

      UtilController.sendSuccess(req, res, next, {
        message: "Updated the budgets successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, error);
    }
  },

  createBudget: async (req, res, next) => {
    try {
      const { userId } = req?.user;
      const createObj = req?.body;

      console.log(createObj?.month,"month in createBudget api");
      

      const {
        startOfMonth,
        endOfMonth,
      } = await UtilController.getStartAndEndOfMoth(createObj?.month);
      console.log(
        startOfMonth,
        endOfMonth,
        "start and end of month in create budget api"
      );

      createObj["userId"] = userId;
      createObj["startDate"] = startOfMonth;
      createObj["endDate"] = endOfMonth;

      await Budget.create(createObj);

      UtilController.sendSuccess(req, res, next, {
        message: "New budget created successfully",
        responseCode: returnCode.validSession,
      });
    } catch (error) {
      UtilController.sendError(req, res, next, error);
    }
  },
};
