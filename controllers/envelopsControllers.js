
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

       const userId = Number(req.user.id);
    

       
        
    const { title, balance } = req.body;
     const indsertedEnvelop =await  db.Envelops.create({
      title,
      balance,
      
      user_id:userId

     })

       res.status(201).json(indsertedEnvelop);
        
           // 6

     
   
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
  
        const { title, balance } = req.body;
        
        const existingUser = await db.Users.findOne({ where: { id: userId } });
if (!existingUser) return res.status(404).send("User Not Found");

const existingEnvelop = await db.Envelops.findByPk(envelopId);
if (!existingEnvelop) return res.status(404).send("envelop not found");


existingEnvelop.title = title;
existingEnvelop.total_budget = balance;
await existingEnvelop.save();





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
    userId = Number(req.user.id)

   
    
const envelops =  await  db.Envelops.findAll({where:{user_id:userId}})
console.log("User Envelops",envelops)
    if(envelops){
      res.status(200).json({msg:"envelops of user retrieved sucessfully",envelops:envelops})
    }else{
      res.status(404).send("User does not have envelops yet")
    }
  
    
  }catch(err){

    res.json({error:err.message})
  }


},
getSingleEnvelop:async(req,res)=>{
  const id = Number(req.params.id)
  try{

    const envelop = await  db.Envelops.findByPk(id)
    if(envelop){

      res.status(200).json({msg:"retrieved sucessfully",envelop:envelop})
    }else{
      res.status(404).send("envelop Not found")


    }


  }catch(err){

    res.json({error:err.message})
  }
}
}