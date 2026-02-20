const { body, validationResult } = require("express-validator");
const express = require("express");
const db = require("../models"); // ✅ لاحظ: بدون /index
const { Transaction } = require("sequelize");
const {  getAllTransactions, deleteTransaction, createTransaction, getSingleTransaction, createTransfer, txByEnvelop } = require("../controllers/transactionControllers");
const { verifyToken } = require("../middleWares/jwt");

const transactionRouter = express.Router();

transactionRouter.post(
  "/transactions/:envelop_id",
  [body("amount").notEmpty().isNumeric().withMessage("amount is required"),

body("type").notEmpty().isString().withMessage("type is required")
  ],
  verifyToken,
  createTransaction
 
);
transactionRouter.post("/transfer/:envelop_id/:to_envelop_id",
   [body("amount").notEmpty().isNumeric().withMessage("amount is required"),

body("type").notEmpty().isString().withMessage("type is required")
  ],
  verifyToken,
 createTransfer)

transactionRouter.get("/transactions/:id",verifyToken,getSingleTransaction)


transactionRouter.get("/transactions",verifyToken,getAllTransactions)
transactionRouter.get("/transactions-by-envelop/:envelop_id", verifyToken,txByEnvelop)

transactionRouter.delete("/transactions/:id",verifyToken,deleteTransaction)

module.exports = transactionRouter;
