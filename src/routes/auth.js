// server/src/routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../services/authService.js';
const router = Router();
router.post('/signup', validateBody(signupSchema), AuthController.signup);
router.post('/login', validateBody(loginSchema), AuthController.login);
export default router;
//# sourceMappingURL=auth.js.map