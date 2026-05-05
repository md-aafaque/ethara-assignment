// server/src/services/taskService.ts
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import { TaskStatus, Priority, Role } from '@prisma/client';
export const createTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().uuid(),
    assigneeId: z.string().uuid().optional(),
    teamId: z.string().uuid(), // Required for RBAC check during creation
});
export const updateTaskSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(Priority).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().uuid().optional(),
});
export class TaskService {
    static async getTasks(filters) {
        return prisma.task.findMany({
            // @ts-ignore
            where: {
                project: filters.teamId ? { teamId: filters.teamId } : undefined,
                projectId: filters.projectId,
                status: filters.status,
                assigneeId: filters.assigneeId,
            },
            include: {
                assignee: {
                    select: { id: true, name: true, email: true },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createTask(data) {
        // Basic validation: ensure assignee is in the team (this could also be in a service check)
        if (data.assigneeId) {
            const isMember = await prisma.teamMember.findUnique({
                where: {
                    userId_teamId: {
                        userId: data.assigneeId,
                        teamId: data.teamId,
                    },
                },
            });
            if (!isMember) {
                throw new Error('Assignee must be a member of the team');
            }
        }
        const { teamId, ...taskData } = data;
        return prisma.task.create({
            // @ts-ignore
            data: {
                ...taskData,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });
    }
    static async updateTask(id, userId, data) {
        const task = await prisma.task.findUnique({
            where: { id },
            include: { project: true },
        });
        if (!task) {
            throw new Error('Task not found');
        }
        const membership = await prisma.teamMember.findUnique({
            where: {
                userId_teamId: {
                    userId,
                    teamId: task.project.teamId,
                },
            },
        });
        if (!membership) {
            throw new Error('Not authorized to update this task');
        }
        // RBAC: Member can only update status of their OWN tasks
        if (membership.role === Role.MEMBER) {
            if (task.assigneeId !== userId) {
                throw new Error('Members can only update tasks assigned to them');
            }
            // Check if they are trying to update fields other than status
            const keys = Object.keys(data);
            if (keys.length > 1 || (keys.length === 1 && keys[0] !== 'status')) {
                throw new Error('Members can only update the status of their assigned tasks');
            }
        }
        return prisma.task.update({
            where: { id },
            // @ts-ignore
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });
    }
    static async deleteTask(id) {
        return prisma.task.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=taskService.js.map