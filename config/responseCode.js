module.exports = {
  returnCode: {
    validEmail: 101, //User email id is success, this account valid check
    emailNotFound: 103, //User email id not found / wrong email id
    passwordMismatch: 104, //Password is mismatch
    passwordMatched: 105, //Password matched
    invalidSession: 108, //Session is not valid, relogin to generate new session and associate
    validSession: 109, //Valid session, user account is already login
    havePermission: 111, //User  have permission or not yet reached user limit
    noPermission: 112, //User don't have permission or reached user limit
    noDuplicate: 113, //no Duplicate content, can use it
    duplicate: 114, //Duplicate content, it can title or unique field in collection.
    notVerifiedEmail: 115,
    invalidToken: 118,
    recordNotFound: 123,
    available: 124,
    notAvailable: 125,
    mobileNoAlreadyRegistered: 132,
    success: 100, //	Success
    errror: 600, //	Exception / server errror
  },
};
