// server/src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateBody = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          // @ts-ignore
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      res.status(500).json({ error: 'Internal server error during validation' });
    }
  };
};
