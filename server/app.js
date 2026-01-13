// server/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './routes/AuthRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
    const app = express();

    // Middleware de logging para debug
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        next();
    });

    // Middleware CORS
    app.use(cors({
        origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], // Angular frontend
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rutas
    app.use('/', authRoutes);

    // Servir archivos estáticos de Angular (cuando tengas la build)
    app.use(express.static(path.join(__dirname, "../client/dist"))); // Ajusta según tu build

    return app;
};