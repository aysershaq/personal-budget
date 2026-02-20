const { body, validationResult } = require("express-validator");
const express = require("express");
const db = require("../models"); // ✅ لاحظ: بدون /index
const { Transaction } = require("sequelize");
const { transferMoney, getAllTransactions, deleteTransaction, createTransaction, getSingleTransaction } = require("../controllers/transactionControllers");
const { verifyToken } = require("../middleWares/jwt");

const transactionRouter = express.Router();

transactionRouter.post(
  "/transactions/:envelop_id/:to_envelop_id",
  [body("amount").notEmpty().isNumeric().withMessage("amount is required"),

body("type").notEmpty().isString().withMessage("type is required")
  ],
  verifyToken,
  createTransaction
 
);

transactionRouter.get("/transactions/:id",verifyToken,getSingleTransaction)


transactionRouter.get("/transactions",verifyToken,getAllTransactions)


transactionRouter.delete("/transactions/:id",verifyToken,deleteTransaction)

module.exports = transactionRouter;
