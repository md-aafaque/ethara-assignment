// server/src/controllers/teamController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { TeamService } from '../services/teamService.js';

export class TeamController {
  static async createTeam(req: AuthRequest, res: Response) {
    try {
      const team = await TeamService.createTeam(req.user!.id, req.body);
      res.status(201).json(team);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getMyTeams(req: AuthRequest, res: Response) {
    try {
      const teams = await TeamService.getUserTeams(req.user!.id);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTeamDetails(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      const team = await TeamService.getTeamDetails(req.params.teamId);
      if (!team) return res.status(404).json({ error: 'Team not found' });
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addMember(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      const membership = await TeamService.addMember(req.params.teamId, req.body);
      res.status(201).json(membership);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removeMember(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      await TeamService.removeMember(req.params.teamId, req.params.userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
