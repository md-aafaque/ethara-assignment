import { ZodError } from 'zod';
export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
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
//# sourceMappingURL=validate.js.map