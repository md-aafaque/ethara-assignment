import { DashboardService } from '../services/dashboardService.js';
export class DashboardController {
    static async getDashboard(req, res) {
        try {
            const stats = await DashboardService.getDashboardStats(req.user.id);
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=dashboardController.js.map