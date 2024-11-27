import express from "express";
import { Login, SignUp } from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/login", Login);
userRouter.post("/signup", SignUp);

export default userRouter;
