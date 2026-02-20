const db = require("../models"); // ✅ لاحظ: بدون /index
const { Users } = require("../models/Users");
const { body, validationResult } = require('express-validator');
require("dotenv").config();


const bcrypt = require("bcrypt")
// const sequelize = require("sequelize")
const jwt = require("jsonwebtoken")

module.exports ={

  registerUser:async(req , res)=>{

  const {name ,email,password} = req.body;

const passwordRaw = req.body?.password;

// 1) لو جاية Array (مثلاً من form-data أو تكرار المفتاح)
let passwordStr = Array.isArray(passwordRaw) ? passwordRaw[0] : passwordRaw;

// 2) لو جاية Object لأي سبب (غالبًا من عميل/فورم سيء)
if (passwordStr && typeof passwordStr === "object") {
  // حاول تقرأ value لو موجودة، وإلا خلّيها فاضية
  passwordStr = typeof passwordStr.value === "string" ? passwordStr.value : "";
}

// 3) تحقق صارم
if (typeof passwordStr !== "string") {
  return res.status(400).json({ error: "password must be a string" });
}

   passwordStr = passwordStr.trim();
if (passwordStr.length < 4) {
  return res.status(400).json({ error: "password must be at least 4 characters" });
}
    
try{
  const errors = validationResult(req)

  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

   const existingUser = await db.Users.findOne({where:{email:email}})

   if(existingUser){

    res.status(400).send("User Already exists")
   }else{

   

const salt = await  bcrypt.genSalt(10)
const hashedPassword=await  bcrypt.hash(passwordStr,salt)
        const users =await  db.Users.findAll()
        console.log(typeof users)
        console.log(users)
        console.log("length of object is ",Object.keys(users).length)
          if(Object.keys(users).length === 0){
            const role="admin"
      // await db.Income.create({user_id:})
    const user =await   db.Users.create({user_name:name,email:email,password:hashedPassword,role:role})
                       console.log(user)
                     await db.Income.create({user_id:user.id,income:0})
                    await db.Expenses.create({user_id:user.id,spent:0})

    res.status(201).json({msg:"registered sucessfully",NewUser:user})
              }else{
                 const role="user"

                   const user =await   db.Users.create({user_name:name,email:email,password:hashedPassword,role:role})
                      await db.Income.create({user_id:user.id,income:0})
                     await db.Expenses.create({user_id:user.id,spent:0})
                   res.status(201).json({msg:"registered sucessfully",NewUser:user})
              }
   }
  
}catch(err){
  res.status(500).json({error:err.message})

}


},
deleteUser:async(req,res)=>{

try{
  const user =await db.Users.findByPk(Number(req.params.id))
  if(user){

    await db.Income.destroy({where:{id:Number(req.params.id)}})
    await db.Expenses.destroy({where:{id:Number(req.params.id)}})
    await  db.Users.destroy({where:{id:Number(req.params.id)}})
    res.status(200).json({msg:"user deleted sucessfully",deletedUser:user})
  }else{
    
    res.status(404).send("User not found")
}
}catch(err){

  res.status(500).json({error:err.message})
}
},
getAllUsers:async(req ,res)=>{
  try{

    const users = await db.Users.findAll()

    if(users.length === 0){
       res.send("No user Found in the DB ")
     
     
    }else{
       res.status(400).json({users:users})
    }
  }catch(err){

    res.json({error:err.message})
  }
},
logInUser:async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    // تحديد هل الإدخال إيميل أم اسم مستخدم
    const isEmail = identifier.includes("@");

    const user = await db.Users.findOne({
      where: isEmail
        ? { email: identifier }
        : { user_name: identifier }
    });

    if (!user) {
      return res.status(401).json({ message: "not valid user name or email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "password not match" });
    }

    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    // إنشاء JWT
    const token = jwt.sign(
      { id: user.id ,
        role: user.role 
      },
     
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
     console.log(user.role)

    res.json({msg:"login sucessfully",user:user, token:token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
getSingleUser:async(req ,res)=>{
  const userId = req.user.id
  try{
    const user =await  db.Users.findOne({where:{id:userId}})
    if(user){
      res.json({msg:"user retrievrd sucessfully",user:user})
    }else{
      res.send("User Not found")
    }
  }catch(err){

    res.json({error:err.message})
  }
},

logOutUser:(req, res) => {

 res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    path: "/",              // مهم
  });

  return res.status(200).json({ message: "Logged out" });
},
 
}

