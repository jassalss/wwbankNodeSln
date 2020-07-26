const Converter = (amount, currency) => {
  if (currency !== "USD" && currency !== "MXN") {
    const error = new Error("Only USD OR MXN or CAD currency allowed");
    error.statusCode = 404;
    throw error;
  }
  if (currency === "USD") {
    return amount * 2.0;
  } else if (currency === "MXN") {
    return amount / 10.0;
  }
};
const currentDateTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};
const comapreTheAccount = (objFromDB, userInput) => {
  let message = "";
  let result = false;
  if (objFromDB.AccountNumber === userInput.AccountNumber) {
    if (objFromDB.CustomerId === userInput.CustomerId) {
      if (objFromDB.CustomerName === userInput.CustomerName) {
        result = true;
      } else {
        message =
          "Customer name did not match with provided account number. This is not your account";
      }
    } else {
      message =
        "Customer Id did not match with provided account number. This is not your account";
    }
  } else {
    message = "No account match!";
  }
  return { result, message };
};
exports.Converter = Converter;
exports.currentDateTime = currentDateTime;
exports.comapreTheAccount = comapreTheAccount;
