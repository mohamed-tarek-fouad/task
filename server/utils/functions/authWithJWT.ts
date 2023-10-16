import passport from "passport";
import {
  internalServerErrorResponse,
  unAuthorizedResponse,
} from "./responseHandler";
import { NextFunction } from "express";

export default async function authenticateWithJWT(
  req: any,
  res: any,
  next: any
) {
  const authenticationFunction = passport.authenticate(
    "jwt",
    { session: false },
    async (clientError: any, data: any, err: any) => {
      if (err) {
        if (err.message === "jwt expired") {
          return unAuthorizedResponse(res, "Session expired");
        }
        if (err.message === "invalid signature") {
          return unAuthorizedResponse(res, "Invalid signature");
        }
        return internalServerErrorResponse(res, "no token ");
      }
      if (clientError) {
        return internalServerErrorResponse(
          res,
          "An error has occured on the server"
        );
      }
      if (!data) {
        return unAuthorizedResponse(res, "Invalid token");
      }
      req.user = data;
      next();
    }
  );
  return authenticationFunction(req, res, next);
}
