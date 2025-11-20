const responseCode = require("../../../config/responseCode").returnCode;
const CryptoJS = require("crypto-js");

module.exports = {
  sendSuccess: async (req, res, next, data) => {
    if (module.exports.isEmpty(data.responseCode)) {
      data["responseCode"] = responseCode.validSession;
    }
    res.status(200).send({
      message: "success",
      code: responseCode.success,
      data: data,
    });
  },

  sendError: async (req, res, next, err) => {
    // console.error(err);
    res.status(500).send({
      message: "failure",
      code: responseCode.errror,
      data: err,
    });
  },

  isEmpty: (data) => {
    let returnObj = false;
    if (
      typeof data === "undefined" ||
      data === null ||
      data === "" ||
      data === "" ||
      data.length === 0
    ) {
      returnObj = true;
    }
    return returnObj;
  },

  comparePassword: (passwordHash, userPassword, secretKey) => {
    let returnObj = responseCode.passwordMismatch;
    try {
      // Decrypt
      let bytes = CryptoJS.AES.decrypt(passwordHash, secretKey);
      let decryptedPwd = bytes.toString(CryptoJS.enc.Utf8);
      //   console.log("decryptedPwd", decryptedPwd);
      if (decryptedPwd === userPassword) {
        returnObj = responseCode.passwordMatched;
      }
    } catch (err) {
      console.error(err);
      returnObj = responseCode.userException;
    } finally {
      return returnObj;
    }
  },

  getStartAndEndOfMoth: (epochSeconds) => {
    const currentDate = new Date(epochSeconds * 1000);

    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Get the end of the month
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    const endOfMonth = new Date(nextMonth - 1);

    return {
      startOfMonth: Math.floor(startOfMonth / 1000),
      endOfMonth: Math.floor(endOfMonth / 1000),
    };
  },
};
