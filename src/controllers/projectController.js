import { ProjectService } from '../services/projectService.js';
export class ProjectController {
    static async getProjects(req, res) {
        try {
            const projects = await ProjectService.getProjects(req.query.teamId);
            res.json(projects);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async createProject(req, res) {
        try {
            const project = await ProjectService.createProject(req.body);
            res.status(201).json(project);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async deleteProject(req, res) {
        try {
            // @ts-ignore
            await ProjectService.deleteProject(req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=projectController.js.map