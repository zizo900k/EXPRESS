import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ProduitModel } from "../Models/ProductModel.mjs";
import data from "../mock-data.json" with { type: "json" };
import data2 from "../product.json" with {type:"json"};


dotenv.config()
const db = process.env.DBCONNECT
mongoose.connect(db).then(console.log("connected to mongo")).catch(err=>console.log(err))



export const Usercontroller = express.Router();

Usercontroller.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

Usercontroller.get("/product", (req, res) => {
  res
    .status(200)
    .json({
      id: 1,
      name: "PC",
      price: 1200,
      quantity: 5,
      description: "High performance PC",
      category: "Electronics",
    })
    ;
});
Usercontroller.get("/data", (req, res) => {
  res.status(200).json(data);
});


// ------------PARAMS--------

Usercontroller.get("/product/:id", (req, res) => {
    const {params:{id}}=req
    try{
      const product = data2.products.find(p=>{
     return p.id ==id
    })
    if (product){
      res.status(200).send(product)
    }
    else {
      res.status(404).send({
        message: "not found"
      })
    }
    }catch(err){
      console.log(err);
      
    }
});

// ----------------QUERY---------------

Usercontroller.get("/category", (req,res)=>{
  const {query:{category}}=req
  if (category){
    const product = data2.products.filter(c=>c.category==category)
    if (product.length>0){
      res.status(200).send(product)
    }
    else{res.status(404).send("not found")}
  }
  else {res.status(200).send(data2.products)}
})



// ------------------CRUD--------------


let users = [
  { id: 1, name: 'Mohamed', age: 25 },
  { id: 2, name: 'Sara', age: 22 }
];

// ---------------------GET----------------------

Usercontroller.get('/users', (req, res) => {
  res.json(users);
});

// -------------------POST-------------------

Usercontroller.post('/users', (req, res) => {
  const newU= req.body;
  users.push(newU);
  res.status(201).send('User added successfully');
});

// -----------------------PUT-------------------

Usercontroller.put('/users/:id', (req, res) => {
  const {params: { id } } = req;
  const updatedU = req.body;
  users = users.map(u =>
    u.id == id ? { ...u, ...updatedU } : u);

  res.json({ message: 'User updated', allUsers: users });
});


// ---------------------PATCH-------------------

Usercontroller.patch('/users/:id', (req, res) => {
  const { params: { id } } = req;
  const updates = req.body;

  let user = users.find(u => u.id == id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user = { ...user, ...updates };
  users = users.map(u => (u.id == id ? user : u));
  res.json({ message: 'User patched successfully', user });
});



// -----------DELETE-----------------

Usercontroller.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u=> u.id !== id);
  res.json({ message: 'User deleted', allUsers: users });
});

// ----------------MONGO---------------------


// -----------------GET-----------------
Usercontroller.get("/produits" , async(req,res)=>{
  const {category}=req.query
  const produits = await ProduitModel.find()
  if(category){
    const flitred = produits.filter((p=>p.category==category))
    if(flitred.length>0){
      return res.status(200).send(flitred)
    }else {
      return res.status(404).send("Not Found")
    }
  }return res.status(200).send(produits)
})

// ---------------GET(PARAMS)----------------------

Usercontroller.get("/produit/:id",async(req,res)=>{
  const {id}=req.params
  const parsID = parseInt(id)
  console.log(parsID);
  
  if(!isNaN(parsID)){
    const produit = await ProduitModel.findOne({id:parsID})
    if(produit){
      return res.status(200).send(produit)
    }
    else {
      return res.status(404).send("Not Found")
    }
  }else {
    return res.status(400).send("Bad Request")
  }
})

// ------------------POST--------------------

Usercontroller.post("/Addproduit" ,async(req,res)=>{
  const {name , price , quantity , description , category  }=req.body
  const prods = await ProduitModel.find()
  const lastid = prods[prods.length-1].id+1
if (name && price && quantity && description && category){
  const nweproduit = new ProduitModel ({
    id:lastid,
    name,
    price,
    quantity,
    description,
    category

  })
  const savedproduit = nweproduit.save()
  return  res.status(201).send("ADD SUCSEFYLD")
}
else {
  return res.status(400).send("BAD REQUEST")
}
})

// --------------------DELETE---------------------

Usercontroller.delete("/deleteproduit/:id",async(req,res)=>{
  const {id} = req.params
  const parsid = parseInt(id)
  if(!isNaN(parsid)){
  const Product = await ProduitModel.findOne({id:parsid})
  if (Product){
        await  ProduitModel.deleteOne({id:parsid})
        return res.status(200).send("PRODUCT DELETED")
  } 
  else{
    res.status(404).send("Not Found")
  }}
  else {
    return res.status(400).send("Bad Request")
  }
})

// ------------------PUT----------------
Usercontroller.put("/updatep/:id",async(req,res)=>{
  const {id} = req.params
  const psid= parseInt(id)
  const {name , price , quantity , description , category  }=req.body
  if (!name && !price && !quantity && !description && !category){
    return res.status(400).send("Bad Request")
  }
  const produit =  await ProduitModel.findOneAndUpdate({id:psid},{name , price , quantity , description , category},{new:true})
  if (!produit){
    return res.status(404).send("Not Found")
  }
  return res.status(200).send("Product updated")
 }
)


// -----------------PATCH-------------------

Usercontroller.patch("/updatONE/:id",async(req,res)=>{
  const {id} = req.params
  const psid= parseInt(id)
  const {price   }=req.body
  if ( !price) {
    return res.status(400).send("Bad Request")
  }
  const produit =  await ProduitModel.findOneAndUpdate({id:psid},{ price },{new:true})
  if (!produit){
    return res.status(404).send("Not Found")
  }
  return res.status(200).send("Product updated")
 }
)



