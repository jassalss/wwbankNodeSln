const { mockRequest, mockResponse } = require("../../util/interceptor");
const transfer = require("../../controllers/transfer");

describe("Check conroller method 'transferTheMoney' ", () => {
  test("should return 201 and both are same account", async () => {
    let req = mockRequest();
    let input = {
      toAccountNum: 185,
      fromAccountnum: 185,
      amount: 27,
      customerId: 23,
      customerName: "simer",
      currencyType: "MXN",
    };

    req.body = input;
    const res = mockResponse();
    await transfer(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `Opernation Failed. From account and To account both are same`,
    });
  });
});
describe("Check conroller method 'transferTheMoney' ", () => {
  test("should return 201 and transfer amount is greated than balance", async () => {
    let req = mockRequest();
    let input = {
      toAccountNum: 185,
      fromAccountnum: 186,
      amount: 100000,
      customerId: 23,
      customerName: "simer",
      currencyType: "CAD",
    };

    req.body = input;
    const res = mockResponse();
    await transfer(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Requested Transfer amount is greater than balance",
    });
  });
});
describe("Check conroller method 'transferTheMoney' ", () => {
  test("should return 201 and ID or name don't match message", async () => {
    let req = mockRequest();
    let input = {
      toAccountNum: 185,
      fromAccountnum: 186,
      amount: 100000,
      customerId: 13,
      customerName: "DD",
      currencyType: "CAD",
    };

    req.body = input;
    const res = mockResponse();
    await transfer(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `Customer Name or Customer Id did not match with provided account number`,
    });
  });
});
describe("Check conroller method 'transferTheMoney' ", () => {
  test("should return 201 and one account don't exist", async () => {
    let req = mockRequest();
    let input = {
      toAccountNum: 1856,
      fromAccountnum: 186,
      amount: 100000,
      customerId: 13,
      customerName: "DD",
      currencyType: "CAD",
    };

    req.body = input;
    const res = mockResponse();
    await transfer(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `To account with account# ${input.toAccountNum} doesnot exist`,
    });
  });
});
describe("Check conroller method 'transferTheMoney' ", () => {
  test("should return 201 and sucessfully transfer", async () => {
    let req = mockRequest();
    let input = {
      toAccountNum: 186,
      fromAccountnum: 185,
      amount: 10,
      customerId: 23,
      customerName: "simer",
      currencyType: "CAD",
    };

    req.body = input;
    const res = mockResponse();
    await transfer(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: `From account# ${input.fromAccountnum} $${input.amount} CAD  sccuessfully transfer to acount# ${input.toAccountNum}`,
    });
  });
});
