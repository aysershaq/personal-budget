

const { body, validationResult } = require('express-validator');
const db = require("../models/index")





module.exports = {

  createTransaction: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const userId = req.user.id
    const envelop_id = Number(req.params.envelop_id);
    const to_envelop_id = Number(req.params.to_envelop_id)
    console.log(to_envelop_id)
    console.log(userId)
    const {amount,type} = req.body

    if (!envelop_id) {
      return res.status(400).json({ error: "Invalid envelop id" });
    }
      try{


          const t = await db.Transactions.create({type:type,amount:amount,user_id:userId,envelop_id:envelop_id})
          const envelop = await db.Envelops.findByPk(envelop_id)
        const result = type === "expense"
                    ? Number(envelop.balance) - Number(amount)
                    : Number(envelop.balance) + Number(amount);


                    if(type==="transfer"){
      const t = await db.Transactions.create({type:type,amount:amount,user_id:userId,envelop_id,envelop_id,to_envelop_id:to_envelop_id})
      const to_envelop = await db.Envelops.findOne({where:{id:to_envelop_id}})
      const result = Number(envelop.balance) - Number(amount);
      const result_2 = Number(to_envelop.balance) + Number(amount) 
      await db.Envelops.update({balance:result_2},{where:{id:to_envelop_id}})
        await db.Envelops.update({balance:result},{where:{id:envelop_id}})

                    }

      
      // ✅ ارجع القيم الجديدة
       res.status(200).json({
        msg: "Transaction created successfully",
        transaction:t
        
      });
    } catch (error) {
     
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  },
  getAllTransactions:async(req,res)=>{
  
    try{
      const allTransactions = await  db.Transactions.findAll()
        if(allTransactions){
      res.status(200).json(allTransactions)
  
        }else{
          res.send("there is not any transactions")
        }
    }catch(err){
  
      res.status(500).json({msg:"internal server error",error:err.message})
    }
  },
  deleteTransaction:async(req,res)=>{

  try{

    const id = Number(req.params.id)
      const Transaction = await db.Transactions.findByPk(id)
      if(Transaction){
     await db.Transactions.destroy({where:{id:id}})
      
    res.status(203).json({msg:"deleted suseccsfully",Transaction})
  }else{
    res.send("transacion not found")
  }
}catch(err){

    res.status(500).json({msg:"internal server error",error:err.message})
  }
},
getSingleTransaction:async(req ,res)=>{
  const id = Number(req.params.id)
  try{

      const t = await db.Transactions.findByPk(id)
      if(t){

        res.status(200).json({msg:"retrieved sucesfully",transaction:t})
      }else{
        res.send("transaction not found")
      }
  }catch(err){

    res.status(500).json({error:err.message})
  }
}
}