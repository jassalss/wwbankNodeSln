const DB = require("../firebaseConfig/firebase");
const { validationResult } = require("express-validator/check");
let realTimeDB = DB.realTimeDB;

const fetchSingleAccount = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    let accountNumber = req.body.accountNumber;
    const eventref = realTimeDB.ref(`allNodeAccounts/${accountNumber}`);
    const snapshot = await eventref.once("value");
    let payload = {};
    if (!snapshot.exists()) {
      payload = { Error: "Account Don't Exist. Try again!" };
    } else {
      payload = snapshot.val();
    }
    res.status(201).json({
      payload,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};
module.exports = fetchSingleAccount;
