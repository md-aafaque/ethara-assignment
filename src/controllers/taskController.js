import { TaskService } from '../services/taskService.js';
export class TaskController {
    static async getTasks(req, res) {
        try {
            const tasks = await TaskService.getTasks({
                teamId: req.query.teamId,
                projectId: req.query.projectId,
                status: req.query.status,
                assigneeId: req.query.assigneeId,
            });
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async createTask(req, res) {
        try {
            const task = await TaskService.createTask(req.body);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateTask(req, res) {
        try {
            // @ts-ignore
            const task = await TaskService.updateTask(req.params.id, req.user.id, req.body);
            res.json(task);
        }
        catch (error) {
            const status = error.message.includes('authorized') ? 403 : 400;
            res.status(status).json({ error: error.message });
        }
    }
    static async deleteTask(req, res) {
        try {
            // @ts-ignore
            await TaskService.deleteTask(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=taskController.js.map