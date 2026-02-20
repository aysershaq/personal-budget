

const { body, validationResult } = require('express-validator');
const db = require("../models/index")





module.exports = {

  createTransaction: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const userId = req.user.id
    const envelop_id = Number(req.params.envelop_id);

   
    console.log(userId)
    const {amount,type,date} = req.body

    if (!envelop_id) {
      return res.status(400).json({ error: "Invalid envelop id" });
    }
      try{

          const e = await db.Envelops.findByPk(envelop_id)
          
          console.log("e value is ",e)

         
          if(type === "expense" && e.balance>=amount){
       const t = await db.Transactions.create({date,type:type,amount:amount,user_id:userId,envelop_id:envelop_id,envelope_name:e.title,to_envelop_id:null})


        const result = Number(e.balance)- Number(amount)
        await db.Envelops.update({balance:result},{where:{id:envelop_id}})
                 
 res.status(201).json({
        msg: "Transaction created successfully",
        transaction:t
        
      });

            

                    }else if(type==="income"){
                     const t = await db.Transactions.create({date,type:type,amount:amount,user_id:userId,envelop_id:envelop_id,envelope_name:e.title})

          const result = Number(e.balance)+Number(amount)
        await db.Envelops.update({balance:result},{where:{id:envelop_id}})
         res.status(201).json({
        msg: "Transaction created successfully",
        transaction:t
        
      });
                    }else{
                        res.send("Not sufficient funds to expend")
                    }
                    
                    
           }  catch (error) {
     
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }

 
  },
  createTransfer:async(req,res)=>{
 const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const userId = req.user.id
    const envelop_id = Number(req.params.envelop_id);
    const to_envelop_id = Number(req.params.to_envelop_id)
        if (!envelop_id || !to_envelop_id) {
      return res.status(400).json({ error: "Invalid envelop id" });
    }
   

    const {amount,type,date} = req.body
      try{
          const fromEnv = await db.Envelops.findByPk(envelop_id)
        const toEnv = await db.Envelops.findByPk(to_envelop_id)
          if(type==="transfer" && fromEnv.balance>=amount){
                const t = await db.Transactions.create({date,type:type,amount:amount,user_id:userId,envelop_id:envelop_id,to_envelop_id,envelope_name:fromEnv.title,to_envelop:toEnv.title})
                const result_1 = Number(fromEnv.balance) - Number(amount)
                const result_2 = Number(toEnv.balance) + Number(amount)
                await db.Envelops.update({balance:result_1},{where:{id:envelop_id}})
                  await db.Envelops.update({balance:result_2},{where:{id:to_envelop_id}})
                  res.status(201).json({
        msg: "Transfer created successfully",
        transaction:t
        
      });

          }else{
            res.send("not sufficient funds to transfer")
          }
            
      }catch(err){
      return res.status(500).json({ error: "Internal server error", details: err.message });


      }

  },
  getAllTransactions:async(req,res)=>{
  const userId = req.user.id
    try{
      const allTransactions = await db.Transactions.findAll({where:{user_id:userId}})
        if(allTransactions){
      res.status(200).json(allTransactions)
  
        }else{
          res.send("there is not any transactions")
        }
    }catch(err){
  
      res.status(500).json({msg:"internal server error",error:err.message})
    }
  },
  txByEnvelop:async(req,res)=>{

    const envelopeId  = req.params.envelop_id
    try{
      const envelop = await db.Transactions.findAll({where:{envelop_id:envelopeId}})
      if(envelop){

        res.json({envelop})
      }else{

        res.send("Envelope has no transactions")
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