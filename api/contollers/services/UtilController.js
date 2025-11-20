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
    const ms = Number(epochSeconds) * 1000;
    const d = new Date(ms);

    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    return {
      startOfMonth: Math.floor(start.getTime() / 1000),
      endOfMonth: Math.floor(end.getTime() / 1000),
    };
  },
};
