import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  badRequestResponse,
  conflictResponse,
  okResponse,
  unAuthorizedResponse,
} from "../utils/functions/responseHandler";
import prisma from "../db/connection";
import bcrypt from "bcrypt";
import createAccessToken from "../utils/functions/createAccessToken";
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body;
    const checkEmail = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return conflictResponse(res, "Email already exists");
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        email,
        password: encryptedPassword,
        name,
      },
      select: { id: true, name: true, email: true },
    });
    const newToken = await prisma.token.create({
      data: {
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(newUser.id, newToken.id);
    return okResponse(res, "User created successfully", {
      ...newUser,
      accessToken,
    });
  }
);
const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return unAuthorizedResponse(res, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return unAuthorizedResponse(res, "Invalid email or password");
    }
    const newToken = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(user.id, newToken.id);
    return okResponse(res, "Login successfully", {
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken,
    });
  }
);
const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    const { userId } = req.params;
    const userExists = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!userExists) {
      return badRequestResponse(res, "user doesn't exist");
    }
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(userId) },
      data: { email, name },
      select: { name: true, email: true, id: true },
    });
    return okResponse(res, "User updated successfully", { updatedUser });
  }
);
const allUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, size = 10 }: any = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const skip = (pageNumber - 1) * pageSize;
    const count = await prisma.users.count();
    const users = await prisma.users.findMany({
      skip,
      take: pageSize,
    });
    return okResponse(res, "Users retrieved successfully", { users, count });
  }
);
const userById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId }: any = req.params;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: { email: true, name: true, id: true },
    });
    return okResponse(res, "User retrieved successfully", { user });
  }
);
const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId }: any = req.params;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return badRequestResponse(res, "User Doesn't exist");
    }
    const deletedUser = await prisma.users.delete({
      where: { id: parseInt(userId) },
      select: {
        email: true,
        name: true,
        id: true,
      },
    });
    return okResponse(res, "User deleted successfully", deletedUser);
  }
);
export default {
  register,
  login,
  updateUser,
  allUsers,
  userById,
  deleteUser,
};
