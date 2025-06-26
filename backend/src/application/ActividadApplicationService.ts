import { Actividad } from '../domain/Actividad';
import { ActividadPort } from '../domain/ActividadPort';

export class ActividadApplicationService {
    private port: ActividadPort;

    constructor(port: ActividadPort) {
        this.port = port;
    }

    async createActividad(actividad: Omit<Actividad, "id">): Promise<number> {
        try {
            return await this.port.createActividad(actividad);
        } catch (error) {
            console.error("Error in ActividadApplicationService.createActividad:", error);
            throw new Error("Failed to create actividad");
        }
    }

    async updateActividad(id: number, actividad: Partial<Actividad>): Promise<boolean> {
        try {
            const existingActividad = await this.port.getActividadById(id);
            if (!existingActividad) {
                throw new Error('Actividad not found');
            }
            return await this.port.updateActividad(id, actividad);
        } catch (error) {
            console.error("Error in ActividadApplicationService.updateActividad:", error);
            throw new Error("Failed to update actividad");
        }
    }

    async deleteActividad(id: number): Promise<boolean> {
        try {
            return await this.port.deleteActividad(id);
        } catch (error) {
            console.error("Error in ActividadApplicationService.deleteActividad:", error);
            throw new Error("Failed to delete actividad");
        }
    }

    async getActividadById(id: number): Promise<Actividad | null> {
        try {
            return await this.port.getActividadById(id);
        } catch (error) {
            console.error("Error in ActividadApplicationService.getActividadById:", error);
            throw new Error("Failed to fetch actividad by ID");
        }
    }

    async getAllActividades(): Promise<Actividad[]> {
        try {
            return await this.port.getAllActividades();
        } catch (error) {
            console.error("Error in ActividadApplicationService.getAllActividades:", error);
            throw new Error("Failed to fetch all actividades");
        }
    }

    async getActividadesByUsuario(usuarioId: number): Promise<Actividad[]> {
        try {
            return await this.port.getActividadesByUsuario(usuarioId);
        } catch (error) {
            console.error("Error in ActividadApplicationService.getActividadesByUsuario:", error);
            throw new Error("Failed to fetch actividades by usuario");
        }
    }

    async getActividadesByFecha(fecha: Date): Promise<Actividad[]> {
        try {
            return await this.port.getActividadesByFecha(fecha);
        } catch (error) {
            console.error("Error in ActividadApplicationService.getActividadesByFecha:", error);
            throw new Error("Failed to fetch actividades by fecha");
        }
    }

    async getActividadesRecientes(limit: number = 10): Promise<Actividad[]> {
        try {
            return await this.port.getActividadesRecientes(limit);
        } catch (error) {
            console.error("Error in ActividadApplicationService.getActividadesRecientes:", error);
            throw new Error("Failed to fetch actividades recientes");
        }
    }

    // Método de utilidad para registrar actividades del sistema
    async registrarActividad(usuarioId: number, accion: string): Promise<number> {
        try {
            const actividad: Omit<Actividad, "id"> = {
                usuario_id: usuarioId,
                accion: accion,
                fecha: new Date()
            };
            return await this.port.createActividad(actividad);
        } catch (error) {
            console.error("Error in ActividadApplicationService.registrarActividad:", error);
            throw new Error("Failed to register actividad");
        }
    }
} 