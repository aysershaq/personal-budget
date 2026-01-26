

const express = require("express");
const { createIncome, createIncomeOfUser, getIncomeOfUsers, getIncomeOfAllUsers } = require("../controllers/incomeControllers");
const { getExpenesOfUser } = require("../controllers/expensesControllers");

const expensesRouter = express.Router();


expensesRouter.get("/expenses/:id",getExpenesOfUser)
expensesRouter.get("/expenses",getIncomeOfAllUsers)

module.exports = expensesRouter