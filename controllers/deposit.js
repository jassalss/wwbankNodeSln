const { validationResult } = require("express-validator/check");

const DB = require("../firebaseConfig/firebase");
let realTimeDB = DB.realTimeDB;
let helper = require("./helper");
const depositTheMoney = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    let body = req.body;
    let amount = body.amount;
    let currencyType = body.currencyType;
    let otherCurrency = "";
    if (currencyType !== "CAD") {
      otherCurrency = ` = $${amount} ${currencyType}`;
      amount = helper.Converter(amount, currencyType);
    }
    let customerObj = {
      AccountNumber: body.accountNumber,
      Amount: amount,
      CustomerId: body.customerId,
      CustomerName: body.customerName,
    };
    const eventref = realTimeDB.ref(
      `allNodeAccounts/${customerObj.AccountNumber}`
    );
    const snapshot = await eventref.once("value");
    let message = `Account with account number ${customerObj.AccountNumber} don't exist`;
    var dateTime = helper.currentDateTime();
    if (snapshot.exists()) {
      let account = snapshot.val();
      let currentBal = parseFloat(account.Balance);
      currentBal += parseFloat(customerObj.Amount);
      account.Balance = currentBal;
      if (account.depositHistory) {
        account.depositHistory += `, ${customerObj.CustomerName} deposited $${customerObj.Amount} CAD ${otherCurrency} in this account at ${dateTime}`;
      } else {
        account.depositHistory = `${customerObj.CustomerName} deposited $${customerObj.Amount} CAD ${otherCurrency} in this account at ${dateTime}`;
      }
      eventref.set(account);
      res.status(201).json({
        message: `Amount $${customerObj.Balance} CAD ${otherCurrency} in account with account number ${customerObj.AccountNumber} by ${customerObj.CustomerName} successfully deposited.`,
      });
    } else {
      res.status(201).json({ message });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
module.exports = depositTheMoney;
