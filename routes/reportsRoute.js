
const express = require("express");
const db = require("../models"); // ✅ لاحظ: بدون /index
const { Transaction } = require("sequelize");
const { verifyToken } = require("../middleWares/jwt");
const { getReportsSummary, getReportsByEnvelop, getReportsActualVsBudget } = require("../controllers/reportsControllers");

const reportsRouter = express.Router();

reportsRouter.get(
  "/reports/summary",
 
  verifyToken,
getReportsSummary
 
)

reportsRouter.get("/reports/by-envelop",verifyToken,getReportsByEnvelop)
reportsRouter.get("/reports/budget-vs-actual",verifyToken,getReportsActualVsBudget)

// reportsRouter.get("/transactions/:id",verifyToken,getSingleTransaction)


// reportsRouter.get("/transactions",verifyToken,getAllTransactions)


// reportsRouter.delete("/transactions/:id",verifyToken,deleteTransaction)

module.exports = reportsRouter;
