// server/src/controllers/taskController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { TaskService } from '../services/taskService.js';
import { TaskStatus } from '@prisma/client';

export class TaskController {
  static async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await TaskService.getTasks({
        teamId: req.query.teamId as string,
        projectId: req.query.projectId as string,
        status: req.query.status as TaskStatus,
        assigneeId: req.query.assigneeId as string,
      });
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createTask(req: AuthRequest, res: Response) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTask(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      const task = await TaskService.updateTask(req.params.id, req.user!.id, req.body);
      res.json(task);
    } catch (error: any) {
      const status = error.message.includes('authorized') ? 403 : 400;
      res.status(status).json({ error: error.message });
    }
  }

  static async deleteTask(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      await TaskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
