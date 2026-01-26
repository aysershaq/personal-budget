const { body, validationResult } = require("express-validator");
const express = require("express");


const bcrypt = require("bcrypt");
const { registerUser, deleteUser, getAllUsers, logInUser, getSingleUser, logOutUser } = require("../controllers/usersController");


const {ensureAdmin, verifyToken}= require("../middleWares/jwt")


const userRouter =  express.Router()




userRouter.post("/register",[body('userName').notEmpty().withMessage('userName is required'),
body('email')
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('email is requires is not valid'),
  body('password')
  .notEmpty()
      .withMessage('password is required')
      .isString()
      .withMessage("password must be string"),
],
      registerUser
    
)
userRouter.post("/login",logInUser)

userRouter.post("/logout",logOutUser)


userRouter.delete("/user/:id",verifyToken, ensureAdmin,deleteUser)


userRouter.get("/users",verifyToken, ensureAdmin ,getAllUsers)

userRouter.get("/user/:id",verifyToken,ensureAdmin,getSingleUser)



module.exports =userRouter