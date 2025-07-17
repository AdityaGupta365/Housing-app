

import UserController from "./user.controller.js";

import express from 'express'

const UserRouter = express.Router();
const UC = new UserController();

UserRouter.post('/signUp',(req,res,next)=>{
    UC.signUp(req,res,next);
})
UserRouter.post('/signIn',(req,res,next)=>{
    UC.signIn(req,res,next);
})


export default UserRouter


