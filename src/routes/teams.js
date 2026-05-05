// server/src/routes/teams.ts
import { Router } from 'express';
import { TeamController } from '../controllers/teamController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeTeamRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validate.js';
import { createTeamSchema, addMemberSchema } from '../services/teamService.js';
import { Role } from '@prisma/client';
const router = Router();
router.use(authenticate);
router.get('/', TeamController.getMyTeams);
router.post('/', validateBody(createTeamSchema), TeamController.createTeam);
router.get('/:teamId', authorizeTeamRole([Role.ADMIN, Role.MEMBER]), TeamController.getTeamDetails);
router.post('/:teamId/members', authorizeTeamRole([Role.ADMIN]), validateBody(addMemberSchema), TeamController.addMember);
router.delete('/:teamId/members/:userId', authorizeTeamRole([Role.ADMIN]), TeamController.removeMember);
export default router;
//# sourceMappingURL=teams.js.map