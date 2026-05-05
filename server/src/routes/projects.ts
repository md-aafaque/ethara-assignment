// server/src/routes/projects.ts
import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeTeamRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validate.js';
import { createProjectSchema } from '../services/projectService.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Note: getProjects expects teamId in query
router.get('/', authorizeTeamRole([Role.ADMIN, Role.MEMBER]), ProjectController.getProjects);
router.get("/projects/:id", authorizeTeamRole([Role.ADMIN, Role.MEMBER]), ProjectController.getProjectById);
router.post('/', validateBody(createProjectSchema), authorizeTeamRole([Role.ADMIN]), ProjectController.createProject);
router.delete('/:id', ProjectController.deleteProject); // RBAC for delete is trickier as we need teamId from project, handled in service or via custom middleware

export default router;
