const { mockRequest, mockResponse } = require("../../util/interceptor");
const saveNewCust = require("../../controllers/saveNewCust");
describe("Check conroller method 'withDrawTheMoney' ", () => {
  test("should return 201 and ID don't match message", async () => {
    let req = mockRequest();
    let input = {
      accountNumber: 13,
      balance: 20,
      customerId: 13,
      customerName: "baba",
      currencyType: "CAD",
    };

    req.body = input;
    const res = mockResponse();
    await saveNewCust(req, res);
    expect(res.send).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Account Already exist. Please use another Account Number",
    });
  });
});
