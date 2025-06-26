import { Request, Response } from 'express';
import { ActividadAdapter } from '../adapter/ActividadAdapter';
import { ActividadApplicationService } from '../../application/ActividadApplicationService';

export class ActividadController {
    private app: ActividadApplicationService;

    constructor(app: ActividadApplicationService) {
        this.app = app;
    }

    async createActividad(req: Request, res: Response) {
        try {
            const { usuario_id, accion } = req.body;

            if (!usuario_id || !accion) {
                return res.status(400).json({ error: "usuario_id y accion son requeridos" });
            }

            const actividad: Omit<any, "id"> = {
                usuario_id,
                accion,
                fecha: new Date()
            };

            const actividadId = await this.app.createActividad(actividad);
            return res.status(201).json({ message: "Actividad creada con éxito", actividadId });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getActividadById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            
            const actividad = await this.app.getActividadById(id);
            if (!actividad) return res.status(404).json({ error: "Actividad no encontrada" });
            
            return res.status(200).json(actividad);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getAllActividades(req: Request, res: Response) {
        try {
            const actividades = await this.app.getAllActividades();
            return res.status(200).json(actividades);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las actividades" });
        }
    }

    async getActividadesRecientes(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const actividades = await this.app.getActividadesRecientes(limit);
            return res.status(200).json(actividades);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las actividades recientes" });
        }
    }

    async getActividadesByUsuario(req: Request, res: Response) {
        try {
            const usuarioId = parseInt(req.params.usuarioId);
            if (isNaN(usuarioId)) return res.status(400).json({ error: "ID de usuario inválido" });
            
            const actividades = await this.app.getActividadesByUsuario(usuarioId);
            return res.status(200).json(actividades);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las actividades del usuario" });
        }
    }

    async updateActividad(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            
            const { usuario_id, accion, fecha } = req.body;

            const updateData: any = {};
            if (usuario_id !== undefined) updateData.usuario_id = usuario_id;
            if (accion !== undefined) updateData.accion = accion;
            if (fecha !== undefined) updateData.fecha = fecha;

            const updated = await this.app.updateActividad(id, updateData);
            if (!updated) return res.status(404).json({ error: "Actividad no encontrada o sin cambios" });
            
            return res.status(200).json({ message: "Actividad actualizada con éxito" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    error: "Error interno del servidor",
                    details: error.message,
                });
            }
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteActividad(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
            
            const deleted = await this.app.deleteActividad(id);
            if (!deleted) return res.status(404).json({ error: "Actividad no encontrada" });
            
            return res.status(200).json({ message: "Actividad eliminada con éxito" });
        } catch (error) {
            return res.status(500).json({ error: "Error al eliminar la actividad" });
        }
    }
} 