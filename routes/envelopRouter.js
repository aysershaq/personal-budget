const express = require("express")
const { body, validationResult } = require('express-validator');
const sequelize = require("../models/index")
require('dotenv').config();


const envelopRouter = express.Router()
const Envelops = require("../models/Envelops");
const {createEnvelop, updateEnvelop, deleteEnvelop, getAllEnvelopsOfUser, getSingleEnvelop } = require("../controllers/envelopsControllers");
const {verifyToken} = require("../middleWares/jwt");

envelopRouter.use(express.json())

console.log(typeof deleteEnvelop);
// get all enelops from database



//get envelop by id 
envelopRouter.get("/envelops", verifyToken,getAllEnvelopsOfUser)
envelopRouter.get("/envelops/:id",verifyToken,getSingleEnvelop)

// POST endpoint to create a new envelope
envelopRouter.post(
  '/envelops',
  [
    body('title').notEmpty().withMessage('title is required'),
    body('balance')
      .notEmpty()
      .isNumeric()
      .withMessage('balance must be a number')
      .custom(value => value > 0),
      
   
  ],
  verifyToken,
  createEnvelop
  
);


envelopRouter.patch(
  "/envelops/:envelop_id",
  // body("title").notEmpty().withMessage("title is required"),
  // body("total_budget")
  //   .notEmpty()
  //   .isNumeric()
  //   .withMessage("totalBudget must be a number"),
  // body("spent").isNumeric().withMessage("spent must be a number"),
verifyToken,
updateEnvelop
);



envelopRouter.delete("/envelops/:envelop_id",verifyToken,deleteEnvelop );



module.exports = envelopRouter

// transfer money from one envelop to another
