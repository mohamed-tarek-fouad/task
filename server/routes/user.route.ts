import { Router } from "express";
import loginSchema from "../utils/schemas/login.schema";
import registerSchema from "../utils/schemas/register.schema";
import authController from "../controllers/auth.controller";
import JoiMiddleware from "../middlewares/joi-middleware";
import authenticateWithJWT from "../utils/functions/authWithJWT";
import updateUserSchema from "../utils/schemas/updateUser.schema";
const authRouter = Router();

authRouter.post("/login", JoiMiddleware(loginSchema), authController.login);
authRouter.post(
  "/register",
  JoiMiddleware(registerSchema),
  authController.register
);
authRouter.patch(
  "/updateUser/:userId",
  JoiMiddleware(updateUserSchema),
  authenticateWithJWT,
  authController.updateUser
);
authRouter.get("/allUsers", authenticateWithJWT, authController.allUsers);
authRouter.get(
  "/userById/:userId",
  authenticateWithJWT,
  authController.userById
);
authRouter.delete(
  "/deleteUser/:userId",
  authenticateWithJWT,
  authController.deleteUser
);
export default authRouter;
