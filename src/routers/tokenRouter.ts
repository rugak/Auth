import express from "express";
import * as tokenController from "../controllers/tokenController";

const tokenRouter = express.Router();
tokenRouter.post("/token", tokenController.createToken);

export default tokenRouter;
