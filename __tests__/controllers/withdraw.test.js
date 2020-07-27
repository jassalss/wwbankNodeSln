const { mockRequest, mockResponse } = require("../../util/interceptor");
const withdraw = require("../../controllers/withdraw");
describe("Check conroller method 'withDrawTheMoney' ", () => {
  test("should return 201 and ID don't match message", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 185,
      amount: 20,
      customerId: 13,
      customerName: "baba",
      currencyType: "CAD",
    };
    req.body = input;
    const res = mockResponse();
    await withdraw(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Customer Id did not match with provided account number. This is not your account",
    });
  });
});
describe("Check conroller method 'withDrawTheMoney' ", () => {
  test("should return 201 and balance is less than requested amount", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 185,
      amount: 20,
      customerId: 23,
      customerName: "baba",
      currencyType: "CAD",
    };
    req.body = input;
    const res = mockResponse();
    await withdraw(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Customer name did not match with provided account number. This is not your account",
    });
  });
});
describe("Check conroller method 'withDrawTheMoney' ", () => {
  test("should return 201 and name don't match message", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 185,
      amount: 1000000,
      customerId: 23,
      customerName: "simer",
      currencyType: "USD",
    };
    req.body = input;
    const res = mockResponse();
    await withdraw(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Requested withdraw amount is greater than balance",
    });
  });
});
describe("Check conroller method 'withDrawTheMoney' ", () => {
  test("should return 201 and successfully withdraw money ", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 185,
      amount: 20,
      customerId: 23,
      customerName: "simer",
      currencyType: "USD",
    };
    req.body = input;
    const res = mockResponse();
    await withdraw(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `${input.customerName} withdraw $40 CAD  = $20 USD from acount with account# ${input.accountNumber}.`,
    });
  });
});
