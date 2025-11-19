const { returnCode } = require("../../../config/responseCode");
const User = require("../../model/User");
const { createToken } = require("../services/TokenController");
const UtilController = require("../services/UtilController");
const CryptoJS = require("crypto-js");

module.exports = {
  userLogin: async (req, res, next) => {
    try {
      const { email, password } = req?.body;

      if (UtilController.isEmpty(email) || UtilController.isEmpty(password)) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.emailNotFound,
          message: "Email and Password are required",
        });
      }

      const user = await User.findOne({ email }).select(
        "email name password _id"
      );
      
      if (!user) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.emailNotFound,
          message: "No user with the given email ",
        });
      }

      const passwordMatch = UtilController.comparePassword(
        user?.password,
        password,
        process.env.PASSWORD_SECRET_KEY
      );

      if (passwordMatch !== returnCode.passwordMatched) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: passwordMatch,
          message: "Invalid password",
        });
      }

      const token = createToken(user._id.toString());

      return UtilController.sendSuccess(req, res, next, {
        responseCode: returnCode.validSession,
        message: "Logged in successfully",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

    } catch (error) {
      console.error("Login error:", error);
      return UtilController.sendError(req, res, next, error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const createObj = req?.body;

      const isUserExists = await User.findOne({ email: createObj?.email });
      if (isUserExists) {
        return UtilController.sendSuccess(req, res, next, {
          responseCode: returnCode.duplicate,
          message: "User already exists, use different email",
        });
      }

      let ciphertext = CryptoJS.AES.encrypt(
        createObj?.password,
        process.env.PASSWORD_SECRET_KEY
      );
      createObj["password"] = ciphertext.toString();

      await User.create(createObj);

      UtilController.sendSuccess(req, res, next, {
        responseCode: returnCode.validSession,
        message: "User created successfully",
      });
    } catch (error) {
      console.log("error", error);
      UtilController.sendError(req, res, next, error);
    }
  },
};
