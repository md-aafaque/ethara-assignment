// server/src/middleware/rbac.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export const authorizeTeamRole = (allowedRoles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const teamId = req.params?.teamId || req.body?.teamId || req.query?.teamId;

      if (!userId || !teamId) {
        return res.status(400).json({ error: 'User ID and Team ID are required for authorization' });
      }

      const membership = await prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId,
            teamId: String(teamId),
          },
        },
      });

      if (!membership) {
        return res.status(403).json({ error: 'You are not a member of this team' });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ error: 'Insufficient permissions within the team' });
      }

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      res.status(500).json({ error: 'Internal server error during authorization' });
    }
  };
};
