const jwt = require("jsonwebtoken");
const db = require("../models/index")
module.exports ={


  verifyToken:(req, res, next) =>{
  // قراءة الهيدر بشكل صحيح
  const authHeader = req.headers.authorization || req.get("authorization");

  console.log("authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
      id: decoded.id,
      email: decoded.email,
      role:decoded.role
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
},



 ensureAdmin:(req, res, next)=> {
 console.log("inside ensureAdmin ")
console.log("role",req.user.role)

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin only' });
  }

  next();
}


}



