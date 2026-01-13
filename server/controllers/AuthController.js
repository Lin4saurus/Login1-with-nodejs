// server/controllers/AuthController.js
import { UserService } from '../services/UserService.js';

export class AuthController {
    static async login(req, res) {
        const { username, email, password } = req.body;
        try {
            const user = await UserService.login({ username, email, password });
            res.json({
                success: true,
                user: user,
                message: "Login exitoso"
            });
        } catch (error) {
            console.error("Error al ingresar:", error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async register(req, res) {
        const { username, email, password } = req.body;
        console.log('Datos recibidos en register:', req.body);
        
        try {
            const id = await UserService.create({ username, email, password });
            console.log('Usuario creado exitosamente con ID:', id);
            res.status(200).json({
                success: true,
                id: id,
                message: "registro exitoso"
            });
        } catch (error) {
            console.error("Error al registrar:", error);
            // Usar status 400 para errores de validación y 500 para errores del servidor
            const statusCode = error.message.includes('already exists') || 
                              error.message.includes('must be between') || 
                              error.message.includes('Invalid') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Error al registrar usuario'
            });
        }
    }

    static welcome(req, res) {
        res.json({ message: "hola estrellita, la tierra te dice hola" });
    }

    static changePassword(req, res) {
        const { email, password } = req.body;
        res.json({
            success: true,
            message: "password changed successfully"
        });
    }

    static resetPassword(req, res) {
        const { email, password } = req.body;
        res.json({
            success: true,
            message: "password reset successful"
        });
    }

    static protected(req, res) {
        res.json({
            success: true,
            message: "protected route"
        });
    }
}