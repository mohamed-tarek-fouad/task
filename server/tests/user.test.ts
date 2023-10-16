import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../server";
import { generateRandomString } from "../utils/functions/generateRandomString";
import prisma from "../db/connection";
import createAccessToken from "../utils/functions/createAccessToken";
describe("Test register", () => {
  test.only("Register Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const randomEmail = generateRandomString();
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: `${randomEmail}@gmail.com`,
        password,
        name: "World Ender",
      });
    expect(response.statusCode).toBe(200);
  });
});

describe("Test login", () => {
  test.only("Login Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const hash = await bcrypt.hash(password, 10);
    const randomEmail = generateRandomString();
    await prisma.users.create({
      data: {
        password: hash,
        name: "World Ender",
        email: `${randomEmail}@gmail.com`,
      },
    });
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `${randomEmail}@gmail.com`,
        password,
      });
    expect(response.statusCode).toBe(200);
  });
});
describe("Test UpdateUser", () => {
  test.only("updateuser  Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const hash = await bcrypt.hash(password, 10);
    const randomEmail = generateRandomString();
    const user = await prisma.users.create({
      data: {
        password: hash,
        name: "World Ender",
        email: `${randomEmail}@gmail.com`,
      },
    });
    const newToken = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(user.id, newToken.id);
    const response = await request(app)
      .patch(`/api/auth/updateUser/${user.id}`)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        email: `${randomEmail}@gmail.com`,
        name: "World Ender",
      });
    expect(response.statusCode).toBe(200);
  });
});
describe("Test get all users", () => {
  test.only("allusers Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const hash = await bcrypt.hash(password, 10);
    const randomEmail = generateRandomString();
    const user = await prisma.users.create({
      data: {
        password: hash,
        name: "World Ender",
        email: `${randomEmail}@gmail.com`,
      },
    });
    const newToken = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(user.id, newToken.id);
    const response = await request(app)
      .get(`/api/auth/allusers`)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.statusCode).toBe(200);
  });
});
describe("Test get user by id", () => {
  test.only("UserById Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const hash = await bcrypt.hash(password, 10);
    const randomEmail = generateRandomString();
    const user = await prisma.users.create({
      data: {
        password: hash,
        name: "World Ender",
        email: `${randomEmail}@gmail.com`,
      },
    });
    const newToken = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(user.id, newToken.id);
    const response = await request(app)
      .get(`/api/auth/userById/${user.id}`)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.statusCode).toBe(200);
  });
});
describe("Test delete user by id", () => {
  test.only("deleteUser Stauts Code is 200", async () => {
    const password = "Mm123456@";
    const hash = await bcrypt.hash(password, 10);
    const randomEmail = generateRandomString();
    const user = await prisma.users.create({
      data: {
        password: hash,
        name: "World Ender",
        email: `${randomEmail}@gmail.com`,
      },
    });
    const newToken = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    const accessToken = createAccessToken(user.id, newToken.id);
    const response = await request(app)
      .delete(`/api/auth/deleteUser/${user.id}`)
      .set("Authorization", "Bearer " + accessToken);

    expect(response.statusCode).toBe(200);
  });
});
