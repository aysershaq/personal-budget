

const { body, validationResult } = require('express-validator');
const db = require("../models/index")





module.exports = {

  transferMoney: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const fromEnvelop = Number(req.params.from);
    const toEnvelop = Number(req.params.to);
    const amount = Number(req.body.amountToBeTransferred);

    if ([fromEnvelop, toEnvelop, amount].some(Number.isNaN) || amount <= 0) {
      return res.status(400).json({ error: "Invalid from/to/amount" });
    }

    const t = await db.sequelize.transaction();
    try {
      // ✅ اجلب الظرفين من DB داخل Transaction + Lock
      const from = await db.Envelops.findByPk(fromEnvelop, { transaction: t, lock: t.LOCK.UPDATE });
      const to = await db.Envelops.findByPk(toEnvelop, { transaction: t, lock: t.LOCK.UPDATE });

      if (!from || !to) {
        await t.rollback();
        return res.status(404).json({ error: "Envelope not found" });
      }

      const fromBudget = Number(from.total_budget);
      const toBudget = Number(to.total_budget);

      if (fromBudget < amount) {
        await t.rollback();
        return res.status(400).json({ error: "Insufficient funds" });
      }

      // ✅ حدّث Envelops (مش Transactions)
      from.total_budget = fromBudget - amount;
      to.total_budget = toBudget + amount;

      await from.save({ transaction: t });
      await to.save({ transaction: t });

      // ✅ سجّل العملية
      const insertedTransaction = await db.Transactions.create(
        {
          date: new Date(),
          payment_amount: amount,
          payment_recipient: "transfer",
          from_envelop_id: fromEnvelop,
          to_envelop_id: toEnvelop,
        },
        { transaction: t }
      );

      await t.commit();

      // ✅ ارجع القيم الجديدة
      return res.status(200).json({
        msg: "Transferred successfully",
        insertedTransaction,
        fromEnvelope1: from,
        toEnvelope1: to,
      });
    } catch (error) {
      await t.rollback();
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
    deletedTransaction = await db.Transactions.destroy({where:{id:id}})
      if(deletedTransaction){
    res.json({msg:"deleted suseccsfully",Transaction})
  }else{
    res.send("transacion not found")
  }
}catch(err){

    res.status(500).json({msg:"internal server error",error:err.message})
  }
}
}