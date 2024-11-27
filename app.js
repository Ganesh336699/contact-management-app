import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user-routes.js";
import { auth } from "./middleware/auth.js";

//configs
dotenv.config();
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/user" , userRouter);
app.get("/protected",auth ,(req ,res) => {
    return res.status(200).json({user : req.user});
})




const PORT = process.env.PORT || 5000;

//connecting database
mongoose
  .connect(
    `mongodb+srv://koreganesh114:${process.env.MONGODB_PASSWORD}@cmacluster0.9mxh9.mongodb.net/?retryWrites=true&w=majority&appName=CMACluster0`
  )
  .then(() =>
    app.listen(PORT, () => {
      console.log(`connected to DB and localhost port ${5000}`);
    })
  )
  .catch((e) => console.log(e));
