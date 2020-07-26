const DB = require("../firebaseConfig/firebase");
const { validationResult } = require("express-validator/check");
let realTimeDB = DB.realTimeDB;
let helper = require("./helper");
const transferTheMoney = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    let toAccountNum = req.body.toAccountNum;
    let fromAccountnum = req.body.fromAccountnum;
    let amount = req.body.amount;
    let otherCurrency = req.body.otherCurrency;
    let cust_id = req.body.customerId;
    let cust_name = req.body.customerName;
    let currencyType = req.body.currencyType;
    if (currencyType !== "CAD") {
      otherCurrency = ` = $${amount} ${currencyType}`;
      amount = helper.Converter(amount, currencyType);
    }
    if (await checkAccountExist(toAccountNum)) {
      if (await checkAccountExist(fromAccountnum)) {
        var eventref = realTimeDB.ref(`allNodeAccounts/${fromAccountnum}`);
        var snapshot = await eventref.once("value");
        let FromAccount = snapshot.val();
        let currentBal = parseFloat(FromAccount.Balance);
        let requestBal = parseFloat(amount);
        var dateTime = helper.currentDateTime();
        console.log(FromAccount, cust_name, cust_id);
        if (toAccountNum != fromAccountnum) {
          if (
            FromAccount.CustomerName == cust_name &&
            FromAccount.CustomerId == cust_id
          ) {
            if (currentBal > 0) {
              if (currentBal - requestBal >= 0) {
                currentBal -= requestBal;
                FromAccount.Balance = currentBal;
                eventref.set(FromAccount);
                if (FromAccount.trasferHoster) {
                  FromAccount.depositHistory += `, From account with account# ${fromAccountnum} $${amount} CAD ${otherCurrency} deducted for transfer at ${dateTime}`;
                } else {
                  FromAccount.depositHistory = `From account with account# ${fromAccountnum} $${amount} CAD ${otherCurrency} deducted for transfer at ${dateTime}`;
                }
                eventref = realTimeDB.ref(`allNodeAccounts/${toAccountNum}`);
                snapshot = await eventref.once("value");
                let ToAccount = snapshot.val();
                let currentBal2 = parseFloat(ToAccount.Balance);
                currentBal2 += requestBal;
                ToAccount.Balance = currentBal2;
                eventref.set(ToAccount);
                res.status(201).json({
                  message: `From account ${fromAccountnum} $${amount} CAD ${otherCurrency} sccuessfully transfer to ${toAccountNum}`,
                });
              } else {
                res.status(201).json({
                  message: "Requested Transfer amount is greater than balance",
                });
              }
            } else {
              res.status(201).json({
                message: "Not enough Balance in the account",
              });
            }
          } else {
            res.status(201).json({
              message: `Customer Name or Customer Id did not match with provided account number`,
            });
          }
        } else {
          res.status(201).json({
            message: `Opernation Failed. From account and To account both are same`,
          });
        }
      } else {
        res.status(201).json({
          message: `From account with account# ${fromAccountnum} doesnot exist`,
        });
      }
    } else {
      res.status(201).json({
        message: `To account with account# ${toAccountNum} doesnot exist`,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
const checkAccountExist = async (accountNumber) => {
  const eventref = realTimeDB.ref(`allNodeAccounts/${accountNumber}`);
  const snapshot = await eventref.once("value");
  return await snapshot.exists();
};
module.exports = transferTheMoney;
