const express = require("express");
const { body } = require("express-validator/check");

const saveNewCustomer = require("../controllers/saveNewCust");
const depositTheMoney = require("../controllers/deposit");
const withdraw = require("../controllers/withdraw");
const transferTheMoney = require("../controllers/transfer");
const router = express.Router();

router.post(
  "/save-new-customer",
  [
    body("accountNumber").isNumeric().not().isEmpty(),
    body("balance").isNumeric().not().not().isEmpty(),
    body("customerId").isNumeric().not().isEmpty(),
    body("customerName").trim().not().isEmpty(),
    body("currencyType").trim().not().isEmpty(),
  ],
  saveNewCustomer
);
router.post(
  "/deposit",
  [
    body("accountNumber").isNumeric().not().isEmpty(),
    body("amount").isNumeric().not().not().isEmpty(),
    body("customerId").isNumeric().not().isEmpty(),
    body("customerName").trim().not().isEmpty(),
    body("currencyType").trim().not().isEmpty(),
  ],
  depositTheMoney
);
router.post(
  "/withdraw",
  [
    body("accountNumber").isNumeric().not().isEmpty(),
    body("amount").isNumeric().not().not().isEmpty(),
    body("customerId").isNumeric().not().isEmpty(),
    body("customerName").trim().not().isEmpty(),
    body("currencyType").trim().not().isEmpty(),
  ],
  withdraw
);
router.post(
  "/transfer",
  [
    body("toAccountNum").isNumeric().not().isEmpty(),
    body("fromAccountnum").isNumeric().not().isEmpty(),
    body("amount").isNumeric().not().not().isEmpty(),
    body("customerId").isNumeric().not().isEmpty(),
    body("customerName").trim().not().isEmpty(),
    body("currencyType").trim().not().isEmpty(),
  ],
  transferTheMoney
);
// // POST /feed/post
// router.post("/post", feedController.createPost);

// router.get("/post/:postId", feedController.getPost);

// router.put("/post/:postId", isAuth, feedController.updatePost);

// router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
