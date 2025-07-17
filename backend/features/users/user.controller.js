import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";


const UR=new UserRepository();
export default class UserController{
    async signUp(req,res){
        try{
            const{name,email,role,password}=req.body;
            console.log(req.body);
            const result = await UR.signUp(name,email,role,password);
            if(result){
                return res.send(result);
            }
        }
        catch(err){
            console.log(err);
            return res.send(err);
        }
    }
    async signIn(req,res){
        const {email,password} = req.body;

        const result = await UR.signIn(email,password)
        if(!result){
            return res.send('user not login');
        }
        else{
            const token=jwt.sign(
                {
                    userId:result._id,
                    email:result.email,
                    role:result.role,
                },
                "ABCD",
                {
                    expiresIn:"24h"
                }
            )
            return res.status(200).send({
                user:result,
                token:token,
            });
        }
    }
}