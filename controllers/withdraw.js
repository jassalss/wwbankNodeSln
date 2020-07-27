const { validationResult } = require("express-validator/check");
const DB = require("../firebaseConfig/firebase");
let realTimeDB = DB.realTimeDB;
let helper = require("./helper");

const withDrawTheMoney = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
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
    let message = `No Account exists with given account`;
    var dateTime = helper.currentDateTime();
    if (snapshot.exists()) {
      let account = snapshot.val();
      let result = helper.comapreTheAccount(account, customerObj);
      if (result.result) {
        let currentBal = parseFloat(account.Balance);
        let requestBal = parseFloat(customerObj.Amount);
        if (currentBal > 0) {
          if (currentBal - requestBal >= 0) {
            currentBal -= requestBal;
            account.Balance = currentBal;
            eventref.set(account);
            if (account.depositHistory) {
              account.depositHistory += `, ${customerObj.CustomerName} withdraw $${customerObj.Amount} CAD ${otherCurrency} from this account at ${dateTime}`;
            } else {
              account.depositHistory = `${customerObj.CustomerName} withdraw $${customerObj.Amount} CAD ${otherCurrency} from this account at ${dateTime}`;
            }
            res.status(201).json({
              message: `${customerObj.CustomerName} withdraw $${customerObj.Amount} CAD ${otherCurrency} from account with account# ${customerObj.AccountNumber}.`,
            });
          } else {
            res.status(201).json({
              message: "Requested withdraw amount is greater than balance",
            });
          }
        } else {
          res.status(201).json({
            message: "Not enough Balance in the account",
          });
        }
      } else {
        res.status(201).json({
          message: result.message,
        });
      }
    } else {
      res.status(201).json({
        message,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
module.exports = withDrawTheMoney;
