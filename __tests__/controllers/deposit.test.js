const { mockRequest, mockResponse } = require("../../util/interceptor");
const deposit = require("../../controllers/deposit");

describe("Check conroller method 'depositTheMoney' ", () => {
  test("should 201 and return account don't exist message", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 1855,
      amount: 20,
      customerId: 13,
      customerName: "baba",
      currencyType: "CAD",
    };
    req.body = input;

    const res = mockResponse();
    await deposit(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `Account with account number ${input.accountNumber} don't exist`,
    });
  });
});
describe("Check conroller method 'deposit' ", () => {
  test("should return 201 and amount deposit message", async () => {
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
    await deposit(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `Amount $${input.amount} CAD  in account with account number ${input.accountNumber} by ${input.customerName} successfully deposited.`,
    });
  });
});
