import { PrismaClient, User, RefreshToken } from "@prisma/client";
import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";

export type CreateTokenResponse = {
    accessToken: string,
    accessTokenExpiresAt: Date,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
};

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH!;
const prisma = new PrismaClient();

/**Create */

export const createToken = async (req: Request, res: Response) => {
/* 
   #swagger.tags = ['Access Token']
   #swagger.summary = 'This endpoint create a token.'
   */
    const login: string = req.body.login;
    const password: string = req.body.password;
    const from: string = req.body.from;

    const ip: string = req.ip!;

    // Check if all fields are provided
    if (!login || !password || !from) {
        return res.status(400).json({ errorMessage: "All fields are required" });
    }


    // Check if the user has made too many attempts
    let attempts = await prisma.connexion.findMany({ where: { ipAddress: ip, failed: true, createdAt: { gte: new Date(Date.now() - 300 * 1000) } } });

    if (attempts.length > 3) {

        return res.status(429).json({ errorMessage: "Too many attempts" });
    }
    // Check if the user exists
    let user = await prisma.user.findFirst({ where: { login } });
    if (!user || user.password !== password) {

        await prisma.connexion.create({
            data: {
                ipAddress: ip,
                failed: true,
            }
        });

        return res.status(404).json({ errorMessage: "Login/Password incorrect" });
    }

    if (user.status === "closed") {
        return res.status(403).json({ errorMessage: "Account closed" });
    }
    const tokenData = await createAccessToken(user);

    return res.status(200).json(tokenData);

};

/**Access */
export const createAccessToken = async (user: User | null) =>{

    if (!user) {
        return null;
    }

    const token = jwt.sign({ login: user.login, userRole: user.roles }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ login: user.login }, JWT_SECRET_REFRESH, { expiresIn: "2h" });

    let refreshTokenData = await prisma.refreshToken.findFirst({ where: { userId: user.id } });
    console.log(" refreshToken Data",refreshTokenData);
    if (refreshTokenData) {
        await prisma.refreshToken.delete({ where: { userId: user.id } });
    }

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
        }
    });

    const tokenData: CreateTokenResponse = {
        accessToken: token,
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        refreshToken: refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7200 * 1000),
    } as CreateTokenResponse;

    return tokenData;

};

/**Refresh */
interface CustomTokenPayload extends jwt.JwtPayload {

    login: string;
    userRole: string[];
}

export const createTokenFromRefreshToken = async (req: Request, res: Response) => {
     /* 
  #swagger.tags = ['Refresh Token']
  #swagger.summary = 'This endpoint creates an access token from a refresh token'.
  */
    const refreshToken: string = req.params.refreshToken;

    jwt.verify(refreshToken, JWT_SECRET_REFRESH, async (err, decodedToken) => {

        if (err) {
            return res.status(404).json({ error: 'Token is invalid' });
        }

        if (decodedToken && (decodedToken as CustomTokenPayload).login) {

            const user = await prisma.user.findFirst({ where: { login: (decodedToken as CustomTokenPayload).login } });

            if (!user) {
                return res.status(404).json({ errorMessage: "User not found" });
            }
            if (user.status === "closed") {
                return res.status(403).json({ errorMessage: "Account closed" });
            }

            const tokenData = await createAccessToken(user);

            return res.status(200).json(tokenData);


        };

    });
};

/**Validate */

export const ValidateToken = async (req: Request, res: Response) => {
/* 
   #swagger.tags = ['Access Token']
   #swagger.summary = 'This endpoint create a token.'
   */
    const token: string = req.params.accessToken;

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {

        if (err) {
            return res.status(404).json({ error: 'Token is invalid' });
        }

       const expiresIn =  new Date((decodedToken as JwtPayload).exp!);

        return res.status(200).json({ accessToken: token , accessTokenExpiresAt: expiresIn});

    });

};






