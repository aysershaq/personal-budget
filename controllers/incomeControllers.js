const create_Income = require("../migrations/create_Income")
const db = require("../models/index")
const { Income } = require("../models/Income");




module.exports = {
  getIncomeOfUsers:async(req ,res)=>{
const userId = req.params.id
    try{
      const existing =  await db.Users.findOne({where:{id:userId}})
      if(existing){
      const income =await  db.Income.findOne({where:{user_id:userId}})


         

     res.status(200).json({msg:`income of user id  ${userId} is`,income:income})
       

      }else{
        res.send("User Not Found ")
      }
        
      
       
      }catch(err){
        res.status(500).json({error:err.message})
      }
  },

  getIncomeOfAllUsers:async(req,res)=>{

    try{
      const income = await db.Income.findAll()

        const totalIncome= income.reduce(
                            (sum, n) => sum + Number(n.income || 0),
                                    0
                                 );

      console.log("Total_Income:",totalIncome)
      res.status(200).json({msg:`the Income of all Users is ${totalIncome} `})
    }catch(err){

      res.status(500).json({error:err.message})
    }
  }
 

}