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

  getStartAndEndOfMoth: (month) => {
    // Accepts: epoch seconds (number or numeric string), ms, Date, dayjs, or null
    let epochSec = null;

    if (month === undefined || month === null) {
      epochSec = Math.floor(Date.now() / 1000);
    } else if (typeof month === "number") {
      // if looks like ms (>= 1e12), convert to seconds
      epochSec = String(month).length > 10 ? Math.floor(month / 1000) : month;
    } else if (typeof month === "string" && /^\d+$/.test(month)) {
      // numeric string
      epochSec =
        month.length > 10 ? Math.floor(Number(month) / 1000) : Number(month);
    } else if (month instanceof Date) {
      epochSec = Math.floor(month.getTime() / 1000);
    } else if (month && typeof month.toDate === "function") {
      // dayjs object
      epochSec = Math.floor(month.toDate().getTime() / 1000);
    } else {
      // fallback: try Date parse
      const d = new Date(month);
      epochSec = isNaN(d.getTime())
        ? Math.floor(Date.now() / 1000)
        : Math.floor(d.getTime() / 1000);
    }

    // Use UTC fields to compute month boundaries (safe across server TZs)
    const dUTC = new Date(epochSec * 1000);
    const year = dUTC.getUTCFullYear();
    const monthIndex = dUTC.getUTCMonth(); // 0-11

    const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));

    return {
      startOfMonth: Math.floor(start.getTime() / 1000),
      endOfMonth: Math.floor(end.getTime() / 1000),
    };
  },
};
