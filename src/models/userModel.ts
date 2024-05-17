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

export const updateAccount = async (user: User, callback: Function) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        login: user.login,
        password: user.password,
        roles: user.roles,
        status: user.status
      },
    });

    callback(null, updatedUser);
  } catch (error) {
    callback(error);
  }
}


export const getAccount = async (uid: number, callback: Function) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: uid },
    });

    callback(null, user);
  } catch (error) {
    callback(error);
  }
};
