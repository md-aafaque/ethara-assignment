// server/src/services/dashboardService.ts
import { prisma } from '../lib/prisma.js';
import { TaskStatus } from '@prisma/client';
export class DashboardService {
    static async getDashboardStats(userId) {
        const userTeams = await prisma.teamMember.findMany({
            where: { userId },
            select: { teamId: true },
        });
        // @ts-ignore
        const teamIds = userTeams.map((t) => t.teamId);
        if (teamIds.length === 0) {
            return {
                totalTasks: 0,
                completedTasks: 0,
                overdueTasks: 0,
                myTasks: [],
            };
        }
        const [totalTasks, completedTasks, overdueTasks, myTasks] = await Promise.all([
            // Total tasks in user's teams
            prisma.task.count({
                where: {
                    project: { teamId: { in: teamIds } },
                },
            }),
            // Completed tasks
            prisma.task.count({
                where: {
                    project: { teamId: { in: teamIds } },
                    status: TaskStatus.DONE,
                },
            }),
            // Overdue tasks
            prisma.task.count({
                where: {
                    project: { teamId: { in: teamIds } },
                    status: { not: TaskStatus.DONE },
                    dueDate: { lt: new Date() },
                },
            }),
            // My Tasks (assigned to current user)
            prisma.task.findMany({
                where: {
                    assigneeId: userId,
                },
                include: {
                    project: { select: { name: true, teamId: true } },
                },
                orderBy: { dueDate: 'asc' },
            }),
        ]);
        return {
            totalTasks,
            completedTasks,
            overdueTasks,
            myTasks,
        };
    }
}
//# sourceMappingURL=dashboardService.js.map