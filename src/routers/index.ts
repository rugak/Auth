import { Router } from "express";
import userRouter from "./userRouter";
import tokenRouter from "./tokenRouter";



const mainRouter = Router();

mainRouter.use("/", userRouter);
mainRouter.use("/", tokenRouter);



export default mainRouter;
