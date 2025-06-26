import { Actividad } from './Actividad';

export interface ActividadPort {
    createActividad(actividad: Omit<Actividad, "id">): Promise<number>;
    updateActividad(id: number, actividad: Partial<Actividad>): Promise<boolean>;
    deleteActividad(id: number): Promise<boolean>;
    getActividadById(id: number): Promise<Actividad | null>;
    getAllActividades(): Promise<Actividad[]>;
    getActividadesByUsuario(usuarioId: number): Promise<Actividad[]>;
    getActividadesByFecha(fecha: Date): Promise<Actividad[]>;
    getActividadesRecientes(limit?: number): Promise<Actividad[]>;
} 