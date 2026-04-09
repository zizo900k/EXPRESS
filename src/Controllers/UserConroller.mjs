import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../Models/UserModel.mjs";
import amqp from "amqplib"


dotenv.config();
const db = process.env.DBCONNECT;
const SECRET = process.env.SECRET
mongoose .connect(db).then(console.log("connected to mongo")).catch((err) => console.log(err));

export const UserCon = express.Router();


async function ReciveMessage() {
  const cnx = await amqp.connect("amqp://localhost")
  const channel = await cnx.createChannel();
  const queue = "UserQueue"
  await channel.assertQueue(queue,{durable:true})
  console.log("Im Waiting For Ur messagge");
  channel.consume(queue,(msg)=>{
    const content = msg.content.toString()
    const data = JSON.parse(content);
    console.log("Received message:", content);
    const NewUser = new UserModel(data);
    NewUser.save();
    channel.ack(msg);
    
  })
  
}
ReciveMessage();

  function AuthMiddelwere(req,res,next){
      const token = req.cookies.token
      if(!token){ return res.status(401).send("Acces denied")}
      try{
          const decoded = jwt.verify(token , SECRET)
          req.user = decoded
          next();
      }catch(err){
          return res.status(400).json({error : "invalid Token"})
      }
  }

UserCon.post("/Adduser", async (req, res) => {
  const { name, age, email, password } = req.body;
  const hashpass = await bcrypt.hash(password, parseInt(process.env.SALT));
  const Newuser = new UserModel({
    name,
    age,
    email,
    password: hashpass,
  });
  if (Newuser) {
    const Added = Newuser.save();
    return res.status(201).send("User Added");
  } else {
    return res.status(400).send("Bad Request");``
  }
});
UserCon.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return res.status(400).send("Bad Requset");
  } else {
      
    if (!user) {
      return res.status(404).send("Not Found");
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({_id:user.id},SECRET,{expiresIn:"1h"})
        res.cookie("token" , token ,{httpOnly:true,secure:false , maxAge:60*60*1000})
        return res.status(200).send("Welcome");
      } else {
        return res.status(404).send("Invalid Password");
      }
    }
  }
}); 
UserCon.get("/users",AuthMiddelwere,async(req,res)=>{
    const usrs = await UserModel.find()
    res.status(200).send(usrs)
})
