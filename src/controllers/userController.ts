import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as userModel from "../models/userModel";

export const JWT_SECRET = process.env.JWT_SECRET!;
const prisma = new PrismaClient();

type CreatAccountRequest = {
  login: string;
  password: string;
  roles: string[];
  status: string;
};

/**Create */

export const createAccount = async (req: Request, res: Response) => {
  /* 
   #swagger.tags = ['Account']
   #swagger.summary = 'This endpoint create an account.'
   */

  const token: string | undefined = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ errorMessage: "Authentication required" });
  }

  let isAdmin = false;
  const currentRoles = (jwt.decode(token) as JwtPayload).userRole;
  for (let i = 0; i < currentRoles.length; i++) {
    if (currentRoles[i] === "ROLE_ADMIN") {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    return res.status(403).json({ errorMessage: "Must be admin" });
  }

  const createAccountRequest = req.body as CreatAccountRequest;

  const login: string = createAccountRequest.login;
  const password: string = createAccountRequest.password;
  const roles: string[] = createAccountRequest.roles;
  let status: string = createAccountRequest.status;

  if (!login || !password || !roles) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }

  let user = await prisma.user.findFirst({ where: { login } });

  if (user) {
    return res.status(400).json({ errorMessage: "Login already exists" });
  }

  if (roles.length > 2) {
    return res
      .status(400)
      .json({ errorMessage: "No more than two roles are allowed" });
  }
  if (
    roles.length > 0 &&
    roles.some((role) => role !== "ROLE_ADMIN" && role !== "ROLE_USER")
  ) {
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
    }
  );
};

/**Update */

export const updateAccount = async (req: Request, res: Response) => {
  /* 
     #swagger.tags = ['Account']
     #swagger.summary = 'This endpoint updates an account.'
     */

  // Only admin can access this endpoint
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ errorMessage: "Authentication required" });
  }

  const login: string = req.body.login;
  const password: string = req.body.password;
  const roles: string[] = req.body.roles;
  const status: string = req.body.status;
  const uid: string = req.params.uid;

  if (!uid || !login || !password || !roles || !status) {
    return res.status(400).json({ errorMessage: "All fields are required" });
  }
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] !== "ROLE_ADMIN" && roles[i] !== "ROLE_USER") {
      return res.status(400).json({ errorMessage: "Invalid role" });
    }
  }

  let isAdmin = false;
  const userRoles = (jwt.decode(token) as JwtPayload).userRole;

  for (let i = 0; i < userRoles.length; i++) {
    if (userRoles[i] === "ROLE_ADMIN") {
      isAdmin = true;
    }
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(404).json({ error: "Token is invalid" });
    }

    if (!isAdmin) {
      let currentUser = await prisma.user.findFirst({
        where: { login: (decodedToken as JwtPayload).login },
      });

      if (!currentUser) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      if (uid == "me" || uid == currentUser?.id.toString()) {
        const user: User = {
          login,
          password,
          status,
          updatedAt: new Date(),
          createdAt: currentUser?.createdAt!,
          id: currentUser?.id!,
          roles: currentUser?.roles!,
        };

        userModel.updateAccount(user, (error: Error, updatedUser: User) => {
          if (error) {
            return res.status(500).json({ errorMessage: error.message });
          }

          return res.status(200).json(updatedUser);
        });
      }

      return res.status(403).json({ errorMessage: "Must be admin or owner" });
    } else if (isAdmin) {
      let currentUser = await prisma.user.findFirst({
        where: { login: (decodedToken as JwtPayload).login },
      });

      if (!currentUser) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      const user: User = {
        login,
        password,
        status,
        updatedAt: new Date(),
        createdAt: currentUser.createdAt!,
        id: uid == "me" ? currentUser.id : parseInt(uid),
        roles: roles,
      };

      userModel.updateAccount(user, (error: Error, updatedUser: User) => {
        if (error) {
          return res.status(500).json({ errorMessage: error.message });
        }

        return res.status(200).json(updatedUser);
      });
    }
  });
};

/**Get Account */

export const getAccount = async (req: Request, res: Response) => {
  /* 
   #swagger.tags = ['Account']
   #swagger.summary = 'This endpoint gets an account'
   */

  const token: string | undefined = req.headers.authorization;

  // Only admin and user can access this endpoint
  if (!token) {
    return res.status(401).json({ errorMessage: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(404).json({ error: "Token is invalid" });
    }

    let isAdmin = false;
    const roles = (decodedToken as JwtPayload).userRole;

    for (let i = 0; i < roles.length; i++) {
      if (roles[i] == "ROLE_ADMIN") {
        isAdmin = true;
      }
    }

    let uid: string = req.params.uid;

    if (!isAdmin) {
      const user = await prisma.user.findFirst({
        where: { login: (decodedToken as JwtPayload).login },
      });

      if (uid == "me" || uid == user?.id.toString()) {
        return res.status(200).json(user);
      }

      return res.status(403).json({ errorMessage: "Must be admin or owner" });
    } else if (isAdmin) {
      if (uid === "me") {
        const user = await prisma.user.findFirst({
          where: { login: (decodedToken as JwtPayload).login },
        });
        return res.status(200).json(user);
      }

      const user = await prisma.user.findFirst({
        where: { id: parseInt(uid) },
      });
      return res.status(200).json(user);
    }
  });
};
