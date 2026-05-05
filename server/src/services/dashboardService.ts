// server/src/services/dashboardService.ts
import { prisma } from '../lib/prisma.js';
import { TaskStatus } from '@prisma/client';

export class DashboardService {
  static async getDashboardStats(userId: string, teamId?: string) {
    const userTeams = await prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });
    const teamIds = userTeams.map((t) => t.teamId);

    if (teamIds.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        myTasks: [],
      };
    }

    // If teamId is provided, ensure user belongs to it and use it as the filter
    const effectiveTeamIds = teamId && teamIds.includes(teamId) ? [teamId] : teamIds;

    const [totalTasks, completedTasks, overdueTasks, myTasks] = await Promise.all([
      // Total tasks in filtered teams
      prisma.task.count({
        where: {
          project: { teamId: { in: effectiveTeamIds } },
        },
      }),

      // Completed tasks
      prisma.task.count({
        where: {
          project: { teamId: { in: effectiveTeamIds } },
          status: TaskStatus.DONE,
        },
      }),

      // Overdue tasks
      prisma.task.count({
        where: {
          project: { teamId: { in: effectiveTeamIds } },
          status: { not: TaskStatus.DONE },
          dueDate: { lt: new Date() },
        },
      }),

      // My Tasks (assigned to current user, optionally filtered by team)
      prisma.task.findMany({
        where: {
          assigneeId: userId,
          ...(teamId ? { project: { teamId } } : {}),
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
