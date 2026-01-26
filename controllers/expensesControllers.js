const create_Income = require("../migrations/create_Income")
const db = require("../models/index")
const { Income } = require("../models/Income");






module.exports = {
  getExpenesOfUser:async(req ,res)=>{
const userId = req.params.id
    try{
      const existing =  await db.Users.findOne({where:{id:userId}})
      if(existing){
      const spent =await  db.Expenses.findOne({where:{user_id:userId}})
          if(spent){
          console.log("spent is :",spent)
         

     res.status(200).json({msg:`Expenses of user id  ${userId} is ${spent.spent}`,spent:spent})
          }else{
            res.send("User does not have envelops yet")
          }
         

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