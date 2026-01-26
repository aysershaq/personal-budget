const { body, validationResult } = require("express-validator");
const express = require("express");
const db = require("../models"); // ✅ لاحظ: بدون /index
const { Transaction } = require("sequelize");
const { transferMoney, getAllTransactions, deleteTransaction } = require("../controllers/transactionControllers");

const transactionRouter = express.Router();

transactionRouter.put(
  "/transaction/:from/:to",
  [body("amountToBeTransferred").notEmpty().isNumeric().withMessage("amount is required")],
 transferMoney
);



transactionRouter.get("/transactions",getAllTransactions)


transactionRouter.delete("/transaction/:id",deleteTransaction)

module.exports = transactionRouter;
