// server/src/services/projectService.ts
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(2),
  teamId: z.string().uuid(),
});

export class ProjectService {
  static async getProjects(teamId: string) {
    return prisma.project.findMany({
      where: { teamId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  static async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        tasks: true,
        team: true,
      },
    });
  }

  static async createProject(data: z.infer<typeof createProjectSchema>) {
    return prisma.project.create({
      data: {
        name: data.name,
        teamId: data.teamId,
      },
    });
  }

  static async deleteProject(id: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: project.teamId,
        },
      },
    });

    if (!membership || membership.role !== 'ADMIN') {
      throw new Error('Only team administrators can delete projects');
    }

    return prisma.project.delete({
      where: { id },
    });
  }
}
