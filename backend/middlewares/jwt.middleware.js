
import { json } from "stream/consumers";
import jwt from 'jsonwebtoken'


// const jwtAuth =(req,res,next)=>{
//     const authHeader=req.headers['authorization'];
//     if(!authHeader){
//         return res.status(401).send('Unauthorized');
//     }
//     try{
//         const payload =jwt.verify(authHeader,"ABCD");
//         req.userId=payload.userId;
//         req.userRole=payload.role;
//         next();
//     }
//     catch(err){
//         return res.status(401).send("Unauthorized");
//     }
// }
// export default jwtAuth;




const jwtAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1]; // ✅ Extract token after 'Bearer'
  if (!token) {
    return res.status(401).send('Unauthorized - Token not found');
  }

  try {
    const payload = jwt.verify(token, "ABCD");
    console.log('Decoded Token:', payload); // ✅ Now should log full payload

    req.userId = payload.userId;
    req.userRole = payload.role;
    console.log('User Role:', req.userRole); // ✅ Now should log role like "admin"

    next();
  } catch (err) {
    return res.status(401).send("Unauthorized - Invalid Token");
  }
};
export default jwtAuth;