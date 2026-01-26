
const { body, validationResult } = require('express-validator');
const db = require("../models/index");
const userRouter = require('../routes/usersRoute');


module.exports ={

  getAllEnvelops:async(req,res)=>{

   try {

    const result = await db.Envelops.findAll() // بافتراض وجود جدول users
    res.status(200).json(result);
   
  } catch (err) {
    console.error("Query error", err.stack);
    res.status(500).send('Error retrieving envelops');
  }


},

getSingleEnvelop:async(req,res)=>{
   
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid envelope ID' });
  }

  try {
   const result = await  db.Envelops.findOne({where:{id:id}})

    if (result.length === 0) {
      return res.status(404).json({ error: 'Envelope not found' });
    }

    res.status(200).json(result);
   

   
  } catch (error) {
    console.error('Error fetching envelope:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  
},

createEnvelop:async (req, res) => {
    // Validate request
  

    try {
        const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

       const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId in params" });
    }

        const existing  = await  db.Users.findOne({where:{id:userId}})
        if(existing){
    const { title, total_budget, spent } = req.body;
     const indsertedEnvelop =await  db.Envelops.create({
      title,
      total_budget,
      spent,
      user_id:userId

     })


      const EnvelopsOfUser =await  db.Envelops.findAll({where:{user_id:userId}})
              console.log("Envelops:",EnvelopsOfUser)
              let sum = 0
               const totalSpent = EnvelopsOfUser.reduce(
                  (sum, n) => sum + Number(n.spent || 0),
                                    0
               )
               const totalPrice = EnvelopsOfUser.reduce(
                            (sum, n) => sum + Number(n.total_budget || 0),
                                    0
                                 );

                    console.log("Total_price_is:",totalPrice);
                          const existingRecordInIncome =   await db.Income.findOne({where:{user_id:userId}})
                          if(existingRecordInIncome){
              const income = await db.Income.update({income:totalPrice},
                 { where: { user_id: userId } }
              )
            }else{
              const income = await db.Income.create({user_id:userId,income:totalPrice})
            }
            const existingRecordInExpenses = await db.Expenses.findOne({where:{user_id:userId}})
            if(existingRecordInExpenses){

              const spent = await db.Expenses.update({spent:totalSpent},
                {where:{user_id:userId}}
              )

            }else{

        const spent = await db.Expenses.create({user_id:userId,spent:totalSpent})
        console.log("spent is 123",spent)

            }

        
           // 6

      res.status(201).json(indsertedEnvelop);
    }else{
      res.send("User Not found")
    }
    } catch (error) {
      console.error('Error creating envelope:', error.stack || error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  },
  updateEnvelop:  async (req, res) => {
      
      try {
        const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
        const userId = Number(req.user.id); 
        console.log(userId)
        const envelopId = Number(req.params.envelop_id) // ✔ FIXED
  
        const { title, total_budget, spent } = req.body;
        
        const existingUser = await db.Users.findOne({ where: { id: userId } });
if (!existingUser) return res.status(404).send("User Not Found");

const existingEnvelop = await db.Envelops.findByPk(envelopId);
if (!existingEnvelop) return res.status(404).send("envelop not found");

existingEnvelop.total_budget = total_budget;
existingEnvelop.spent = spent;
await existingEnvelop.save();

const EnvelopsOfUser = await db.Envelops.findAll({ where: { user_id: userId } });

const totalBudget = EnvelopsOfUser.reduce((sum, n) => sum + Number(n.total_budget || 0), 0);
const totalSpent  = EnvelopsOfUser.reduce((sum, n) => sum + Number(n.spent || 0), 0);

await db.Income.update(
  { income: totalBudget },
  { where: { user_id: userId } }
);

await db.Expenses.update(
  { spent: totalSpent },
  { where: { user_id: userId } }
);

 res.status(200).json(existingEnvelop);
     
      
     
       
      
    }catch (error) {
      
        res.status(500).json({ error: "Internal server error", details: error.message });
    }},
   
    deleteEnvelop:async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const envelopId = Number(req.params.envelop_id)
    if (Number.isNaN(envelopId)) {
      return res.status(400).json({ error: "Invalid envelope ID" });
    }

    // 1) احضره أولاً
    const envelope = await db.Envelops.findOne({
  where: { id: envelopId, user_id: userId }})
    if (!envelope) {
      return res.status(404).json({ error: "Envelope not found" });
    }
        const incomeRow = await db.Income.findOne({ where: { user_id: userId } });
    const expensesRow = await db.Expenses.findOne({ where: { user_id: userId } });

    const currentIncome = Number(incomeRow?.income || 0);
    const currentSpent  = Number(expensesRow?.spent || 0);

         await db.Income.update(
      { income: currentIncome - Number(envelope.total_budget || 0) },
      { where: { user_id: userId } }
    );

    await db.Expenses.update(
      { spent: currentSpent - Number(envelope.spent || 0) },
      { where: { user_id: userId } }
    );
    // 2) ثم احذفه
    await envelope.destroy();

    // 3) أرجع البيانات التي كانت موجودة قبل الحذف
    return res.status(200).json({ msg: "deleted successfully", deletedEnvelop: envelope });
  } catch (error) {
    console.error("Error deleting envelope:", error.stack || error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
},
getAllEnvelopsOfUser:async(req,res)=>{

  try{
    userId = Number(req.params.id)

    const existing = await  db.Users.findOne({where:{id:userId}})
    if(existing){
const envelops =  await  db.Envelops.findAll({where:{user_id:userId}})
    if(envelops){
      res.status(200).json({msg:"envelops of user retrieved sucessfully",envelops:envelops})
    }else{
      res.status(404).send("User does not have envelops yet")
    }
    }else{
      res.send("User Not Found")
    }

    
  }catch(err){

    res.json({error:err.message})
  }


}
}