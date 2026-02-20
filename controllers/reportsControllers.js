


const Envelops = require("../models/Envelops");
const db = require("../models/index")


const { Op, fn, col, literal } = require('sequelize');


module.exports = {

  getReportsSummary: async (req, res) => {
   
 const { from, to } = req.query;
  const userId = req.user.id; 
    if (!from || !to) {
    return res.status(400).json({ error: "from and to are required" });
  }

      try{
        const result = await db.Transactions.findOne({
  attributes: [
    [
      fn(
        'SUM',
        literal(`CASE WHEN type = 'income' THEN amount ELSE 0 END`)
      ),
      'total_income'
    ],
    [
      fn(
        'SUM',
        literal(`CASE WHEN type = 'expense' THEN amount ELSE 0 END`)
      ),
      'total_expense'
    ],
    [
      fn(
        'SUM',
        literal(`CASE WHEN type = 'income' THEN amount ELSE -amount END`)
      ),
      'net_cashflow'
    ],
    [
      fn('COUNT', col('*')),
      'tx_count'
    ]
  ],
  where: {
    user_id: userId,               // $1
    date: {
      [Op.gte]: from,         // $2
      [Op.lt]: to          // $3
    }
  },
  raw: true
});

return res.status(200).json({summary:result})
console.log(result);


 
    } catch (error) {
     
      return res.status(500).json({ error: "Internal server error", details: error.message });
    }
  },
  getReportsByEnvelop:async(req,res)=>{
  const userId = req.user.id
  const {from , to } = req.query
    try{
      const result = await db.Transactions.findAll({
  attributes: [
    [col('envelop_id'), 'envelop_id'],
    [col('title'), 'name'],
    [fn('SUM', col('amount')), 'total_expense']
  ],
  include: [
    {
      model: db.Envelops,
      attributes: []
    }
  ],
  where: {
    user_id: userId,          // $1
    type: 'expense',
    date: {
      [Op.gte]: from,    // $2
      [Op.lt]: to        // $3
    }
  },
  group: ['envelop_id','title'],
  order: [[literal('total_expense'), 'DESC']],
  raw: true
});

console.log(result);

res.status(200).json({"By-envelop":result})
    }catch(err){
  
      res.status(500).json({msg:"internal server error",error:err.message})
    }
  },


  getReportsActualVsBudget:async(req,res)=>{

    const userId = req.user.id
    const {from,to} = req.query

  try{

   
    const rows = await db.Envelops.findAll({
  attributes: [
    'id',
    'title',
    [col('balance'), 'budgeted'],

    // actual = مجموع مصروفات الفترة (expense فقط)
    [fn('COALESCE', fn('SUM', col('Transactions.amount')), 0), 'actual'],

    // variance = budgeted - actual
    [
      literal(`"Envelops"."balance" - COALESCE(SUM("Transactions"."amount"), 0)`),
      'variance'
    ]
  ],
  include: [
    {
      model: db.Transactions,
      as: 'Transactions',        // لو عندك alias؛ إن ما عندك احذف as
      attributes: [],
      required: false,           // LEFT JOIN
      where: {
        type: 'expense',
        date: { [Op.gte]: from, [Op.lt]: to }
      }
    }
  ],
  where: { user_id: userId },
  group: ['Envelops.id', 'Envelops.title', 'Envelops.balance'],
  order: [[literal('"actual"'), 'DESC']],
  raw: true
});

console.log(rows);
res.status(200).json({"actual-vs-budget":rows})
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