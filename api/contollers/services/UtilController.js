const responseCode = require("../../../config/responseCode").returnCode;
const CryptoJS = require("crypto-js");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

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

  getStartAndEndOfMoth: (month) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    let date;

    if (!month) {
      date = dayjs().tz("Asia/Kolkata");
    } else if (typeof month === "number") {
      const ms = String(month).length > 10 ? month : month * 1000;
      date = dayjs(ms).tz("Asia/Kolkata");
    } else {
      date = dayjs(month).tz("Asia/Kolkata");
    }

    const startOfMonth = date.startOf("month"); 
    const endOfMonth = date.endOf("month"); 

    return {
      startOfMonth: startOfMonth.unix(), 
      endOfMonth: endOfMonth.unix(), 
    };
  },
};
