import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from '../routes/UserRoutes'; 
import cursoRoutes from '../routes/CursoRoutes';
import horarioRoutes from '../routes/HorarioRoutes';
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
            origin: envs.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes():void{
        this.app.use("/api",userRoutes);
        this.app.use("/api",cursoRoutes);
        this.app.use("/api/horarios", horarioRoutes);
        
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ message: 'Backend funcionando correctamente' });
        });
    }

    getApp(){
        return this.app;
    }
}

export default new App().getApp();