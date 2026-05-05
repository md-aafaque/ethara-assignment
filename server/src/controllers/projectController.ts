// server/src/controllers/projectController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ProjectService } from '../services/projectService.js';

export class ProjectController {
  static async getProjects(req: AuthRequest, res: Response) {
    try {
      const projects = await ProjectService.getProjects(req.query.teamId as string);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProjectById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      // @ts-ignore
      const project = await ProjectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProject(req: AuthRequest, res: Response) {
    try {
      const project = await ProjectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProject(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      await ProjectService.deleteProject(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message.includes('Only team administrators') ? 403 : 400;
      res.status(status).json({ error: error.message });
    }
  }
}
