import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema<any>) => {
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({
          message: "Validation error",
          errors: result.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
          })),
        });
    }
    req.body = result.data;
    next();
  };
};
