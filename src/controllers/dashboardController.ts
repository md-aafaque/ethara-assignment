// server/src/controllers/dashboardController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { DashboardService } from '../services/dashboardService.js';

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const { teamId } = req.query;
      const stats = await DashboardService.getDashboardStats(
        req.user!.id, 
        teamId as string | undefined
      );
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
