import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from '../routes/UserRoutes'; 

class App{
    private app: express.Application;

    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    private middlewares():void{
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private routes():void{
        this.app.use("/api",userRoutes);
        
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ message: 'Backend funcionando correctamente' });
        });
    }

    getApp(){
        return this.app;
    }
}

export default new App().getApp();