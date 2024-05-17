import express from "express";
import * as tokenController from "../controllers/tokenController";

const tokenRouter = express.Router();
tokenRouter.post("/token", tokenController.createToken);
tokenRouter.get("/validate/:accessToken", tokenController.ValidateToken);
tokenRouter.post("/refresh-token/:refreshToken/token", tokenController.createTokenFromRefreshToken);






export default tokenRouter;
