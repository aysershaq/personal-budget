


const express = require("express");
const { createIncome, createIncomeOfUser, getIncomeOfUsers, getIncomeOfAllUsers } = require("../controllers/incomeControllers");

const incomeRouter = express.Router();


incomeRouter.get("/income/:id",getIncomeOfUsers)
incomeRouter.get("/income",getIncomeOfAllUsers)


// incomeRouter.put("/income/:id",updateIncomeOfUser)








module.exports=incomeRouter