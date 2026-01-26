


async function getIncomeOfUser(req,res,next){

      try{
    
      const userId = Number(req.params.id)
      const existing = db.Users.findOne({where:{id:userId}})
      if(existing){
          0
          next()
}else{

        res.send("User Not Found")
      }

      

    }catch(err){

      res.json({error:err.message})
    }
}


module.exports = getIncomeOfUser