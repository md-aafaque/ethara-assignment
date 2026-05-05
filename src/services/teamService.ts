import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import { Role } from '@prisma/client';

export const createTeamSchema = z.object({
  name: z.string().min(2),
});

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role).default(Role.MEMBER),
});

export class TeamService {
  static async createTeam(userId: string, data: z.infer<typeof createTeamSchema>) {
    return prisma.team.create({
      data: {
        name: data.name,
        members: {
          create: {
            userId,
            role: Role.ADMIN,
          },
        },
      },
    });
  }

  static async getUserTeams(userId: string) {
    return prisma.team.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
    });
  }

  static async getTeamDetails(teamId: string) {
    return prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        projects: true,
      },
    });
  }

  static async addMember(teamId: string, data: z.infer<typeof addMemberSchema>) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: data.role,
      },
    });
  }

  static async removeMember(teamId: string, userId: string) {
    // Check if it's the last admin
    const adminCount = await prisma.teamMember.count({
      where: { teamId, role: Role.ADMIN },
    });
    const memberToRemove = await prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });
    if (memberToRemove?.role === Role.ADMIN && adminCount <= 1) {
      throw new Error('Cannot remove the last administrator of a team');
    }
    return prisma.teamMember.delete({
      where: { userId_teamId: { userId, teamId } },
    });
  }
}
