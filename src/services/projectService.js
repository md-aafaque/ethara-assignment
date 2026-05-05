// server/src/services/projectService.ts
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
export const createProjectSchema = z.object({
    name: z.string().min(2),
    teamId: z.string().uuid(),
});
export class ProjectService {
    static async getProjects(teamId) {
        return prisma.project.findMany({
            where: { teamId },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
        });
    }
    static async createProject(data) {
        return prisma.project.create({
            data: {
                name: data.name,
                teamId: data.teamId,
            },
        });
    }
    static async deleteProject(id) {
        return prisma.project.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=projectService.js.map