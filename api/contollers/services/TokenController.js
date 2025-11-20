const passwordSecretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const httpReturnCode = require("../../../config/httpReturnCode");
const UtilController = require("./UtilController");
const { returnCode } = require("../../../config/responseCode");
const User = require("../../model/User");

module.exports = {
  verifyToken: (token) => {
    try {
      var decoded = jwt.verify(token, passwordSecretKey);
      return decoded;
    } catch (err) {
      console.error("error in verify token--", err.name, err.message);
      return err;
    }
  },
  createToken: (uid, expiresIn = "2d") => {
    try {
      var token = jwt.sign({ uid }, passwordSecretKey, {
        expiresIn: expiresIn,
      });
      return token;
    } catch (error) {
      console.error("error in create token----", error);
      return error;
    }
  },
  addUserToReq(req, userObj) {
    try {
      req.user = { ...req?.user, ...userObj };
      return req;
    } catch (error) {
      console.error("error adduserTkn-", error);
      return error;
    }
  },

  verifyAuthTokenForApiRequest: async function (req, res, next) {
    try {
      if (UtilController.isEmpty(req.headers.authtoken)) {
        return UtilController.sendSuccess(
          req,
          res,
          next,
          {
            responseCode: returnCode.invalidSession,
            message: "authtoken not present or empty in headers",
          },
          httpReturnCode.unauthorized
        );
      }
      //verify auth token
      let authtoken = req.headers.authtoken;
      let authtokenResp = module.exports.verifyToken(authtoken);
      if (authtokenResp instanceof Error) {
        return UtilController.sendSuccess(
          req,
          res,
          next,
          {
            responseCode: returnCode.invalidToken,
            result: {
              message: `error verify authtoken: ${authtokenResp.name}`,
            },
          },
          httpReturnCode.unauthorized
        );
      }

      let userId = authtokenResp?.uid;
      let userResp = await User.findOne({ _id: userId });
      module.exports.addUserToReq(req, { userId });

      return next();
    } catch (err) {
      UtilController.sendSuccess(
        req,
        res,
        next,
        {
          result: `err in verify tkn_mv: ${err?.message}`,
          responseCode: returnCode.invalidSession,
        },
        httpReturnCode.unauthorized
      );
    }
  },
};
