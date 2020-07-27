const { mockRequest, mockResponse } = require("../../util/interceptor");
const fetchSingleAccount = require("../../controllers/fetchSingleAccount");

describe("Check conroller method  'fetchSingleAccount' ", () => {
  test("should 201 and return account don't exist message", async () => {
    let req = mockRequest();
    req.body = { accountNumber: 9999999 };

    const res = mockResponse();
    await fetchSingleAccount(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      account: { Error: "Account Don't Exist. Try again!" },
    });
  });
});
describe("Check conroller method  checking with existing account ", () => {
  test("should 201 and return the found account", async () => {
    let req = mockRequest();
    req.body = { accountNumber: 13 };
    let output = {
      AccountNumber: 13,
      Balance: 20,
      CustomerId: 13,
      CustomerName: "baba",
    };
    const res = mockResponse();
    await fetchSingleAccount(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      account: output,
    });
  });
});
