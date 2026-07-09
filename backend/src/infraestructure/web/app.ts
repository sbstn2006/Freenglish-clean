import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from '../routes/AuthRoutes';
import estudianteRoutes from '../routes/EstudianteRoutes';
import docenteRoutes from '../routes/DocenteRoutes';
import userRoutes from '../routes/UserRoutes'; // Rutas de compatibilidad
import cursoRoutes from '../routes/CursoRoutes';
import horarioRoutes from '../routes/HorarioRoutes';
import contactRoutes from '../routes/ContactRoutes';
import inscripcionRoutes from '../routes/InscripcionRoutes';
import actividadRoutes from '../routes/ActividadRoutes';
import chatbotRoutes from '../routes/ChatbotRoutes';
import envs from '../config/environment-vars';

class App{
    private app: express.Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares():void{
        this.app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes():void{
        // Rutas de autenticación 
        this.app.use("/api/auth", authRoutes);
        
        // Rutas de gestión de usuarios por rol 
        this.app.use("/api/admin", estudianteRoutes);
        this.app.use("/api/admin", docenteRoutes);
        
        // Rutas de compatibilidad
        this.app.use("/api", userRoutes);
        
        // Rutas adicionales para compatibilidad
        this.app.use("/api", estudianteRoutes);
        this.app.use("/api", docenteRoutes);
        
        // Rutas de contenido
        this.app.use("/api", cursoRoutes);
        this.app.use("/api/horarios", horarioRoutes);
        this.app.use("/api/inscripciones", inscripcionRoutes);
        this.app.use("/api", actividadRoutes);
        this.app.use("/api", contactRoutes);
        
        //Ruta para el chatbot
        this.app.use("/api/chatbot", chatbotRoutes);
        
        // Health check endpoint
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ message: 'Backend funcionando correctamente' });
        });
    }

    getApp(){
        return this.app;
    }
}

export default new App().getApp();