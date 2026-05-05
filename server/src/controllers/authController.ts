// server/src/controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async me(req: AuthRequest, res: Response) {
    res.json(req.user);
  }
}
