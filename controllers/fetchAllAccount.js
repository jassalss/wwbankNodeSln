const DB = require("../firebaseConfig/firebase");
let realTimeDB = DB.realTimeDB;
const { validationResult } = require("express-validator/check");
const fetchAllAccounts = async (req, res, next) => {
  const eventref = realTimeDB.ref(`allAccounts`);
  const snapshot = await eventref.once("value");
  res.status(201).json({
    AllAccounts: snapshot.val(),
  });
};
module.exports = fetchAllAccounts;
