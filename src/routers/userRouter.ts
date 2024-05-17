import express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/account", userController.createAccount);

userRouter.put("/account/:uid", userController.updateAccount);
userRouter.get("/account/:uid", userController.getAccount);



export default userRouter;
