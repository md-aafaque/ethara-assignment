import { AuthService } from '../services/authService.js';
export class AuthController {
    static async signup(req, res) {
        try {
            const result = await AuthService.signup(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const result = await AuthService.login(req.body);
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=authController.js.map