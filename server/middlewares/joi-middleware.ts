import { Schema } from "joi";
import { badRequestResponse } from "../utils/functions/responseHandler";
export default function JoiMiddleware(schema: Schema) {
  return async (req: any, res: any, next: any) => {
    try {
      if (!schema) {
        throw new Error("Schema is required");
      }
      const value = await schema.validateAsync(req.body, {
        abortEarly: true,
        allowUnknown: false,
        convert: true,
      });
      req.body = value;
      next();
    } catch (err: any) {
      if (err.details) {
        const error = err.details.map((e: any) => e.message).join(",");
        return badRequestResponse(res, error);
      }
      next(err);
    }
  };
}
