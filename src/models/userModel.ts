import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAccount = async (
  login: string,
  password: string,
  roles: string[],
  status: string,
  callback: Function
) => {
  try {
    const user = await prisma.user.create({
      data: {
        login: login,
        password: password,
        roles: roles,
        status: status,
      },
    });

    callback(null, user);
  } catch (error) {
    callback(error);
  }
};

