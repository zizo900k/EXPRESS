import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import cors from  "cors";
import { Usercontroller } from "./Controllers/ProductController.mjs";
import { UserCon } from "./Controllers/UserConroller.mjs";

dotenv.config();
const app =new express();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use("/api", Usercontroller);
app.use("/userapi" , UserCon)
// app.use(cors());
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on  ${PORT}`);
});
