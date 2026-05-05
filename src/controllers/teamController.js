import { TeamService } from '../services/teamService.js';
export class TeamController {
    static async createTeam(req, res) {
        try {
            const team = await TeamService.createTeam(req.user.id, req.body);
            res.status(201).json(team);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async getMyTeams(req, res) {
        try {
            const teams = await TeamService.getUserTeams(req.user.id);
            res.json(teams);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getTeamDetails(req, res) {
        try {
            // @ts-ignore
            const team = await TeamService.getTeamDetails(req.params.teamId);
            if (!team)
                return res.status(404).json({ error: 'Team not found' });
            res.json(team);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addMember(req, res) {
        try {
            // @ts-ignore
            const membership = await TeamService.addMember(req.params.teamId, req.body);
            res.status(201).json(membership);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async removeMember(req, res) {
        try {
            // @ts-ignore
            await TeamService.removeMember(req.params.teamId, req.params.userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=teamController.js.map