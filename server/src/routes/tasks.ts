// server/src/routes/tasks.ts
import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeTeamRole } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../services/taskService.js';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', authorizeTeamRole([Role.ADMIN, Role.MEMBER]), TaskController.getTasks);
router.post('/', validateBody(createTaskSchema), authorizeTeamRole([Role.ADMIN]), TaskController.createTask);
router.patch('/:id', validateBody(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', authorizeTeamRole([Role.ADMIN]), TaskController.deleteTask);

export default router;
