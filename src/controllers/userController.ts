import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import * as userModel from "../models/userModel";

export const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

/**Create */

export const createAccount = async (req: Request, res: Response) => {
 /* 
  #swagger.tags = ['User']
  #swagger.summary = 'This endpoint create an account.'
  */
  const login: string = req.body.login;
  const password: string = req.body.password;
  const roles: string[] = req.body.roles;
  let status: string = req.body.status;


  if (!login || !password || !roles) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  let user = await prisma.user.findFirst({where: {login}});

  if (user) {
    return res.status(400).json({ errorMessage: "Login already exists" });
  }

  if (roles.length > 2) {
    return res.status(400).json({ errorMessage: "No more than two roles are allowed" });
  }
  if (roles.length > 0 && roles.some(role => role !== "ROLE_ADMIN" && role !== "ROLE_USER")) {
    return res.status(400).json({ errorMessage: "Invalid role" });
  }
  if (status !== "open" && status !== "closed" && status !== "") {
    return res.status(400).json({ errorMessage: "Invalid status" });
  }

  if (status === "") {
    status = "open";
  }

  userModel.createAccount(
    login,
    password,
    roles,
    status,
    (error: Error, user: User) => {
      if (error) {
        return res.status(500).json({ errorMessage: error.message });
      }

      return res.status(201).json(user);
    },
  );
};

