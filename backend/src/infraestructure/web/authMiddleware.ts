import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/AuthService";


export function authenticateToken(req: Request, res: Response, next: NextFunction):void{
    
    const autHeader = req.headers["authorization"];
    const token = autHeader && autHeader.split(" ")[1];

    if(!token){
        res.status(401).json({error: "Token requerido"});
        return;
    }

    try { 
        const payload = AuthService.verifyToken(token);
        (req as any).user = payload;
        next();
    } catch (error) {
        res.status(403).json({error: "Token inválido o ya expiró"});
    }
}