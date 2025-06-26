import { ActividadPort } from "../../domain/ActividadPort";
import { ActividadReciente as ActividadEntitie } from "../entities/ActividadReciente";
import { Actividad as ActividadDomain } from "../../domain/Actividad";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class ActividadAdapter implements ActividadPort {
    private actividadRepository: Repository<ActividadEntitie>;

    constructor() {
        this.actividadRepository = AppDataSource.getRepository(ActividadEntitie);
    }

    // Transforma la entidad de infraestructura al modelo de dominio
    private toDomain(actividad: ActividadEntitie): ActividadDomain {
        return {
            id: actividad.id,
            usuario_id: actividad.usuario_id,
            accion: actividad.accion,
            fecha: actividad.fecha
        };
    }

    // Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(actividad: Omit<ActividadDomain, "id">): ActividadEntitie {
        const actividadEntity = new ActividadEntitie();
        actividadEntity.usuario_id = actividad.usuario_id;
        actividadEntity.accion = actividad.accion;
        actividadEntity.fecha = actividad.fecha;
        return actividadEntity;
    }

    async createActividad(actividad: Omit<ActividadDomain, "id">): Promise<number> {
        try {
            const newActividad = this.toEntity(actividad);
            const savedActividad = await this.actividadRepository.save(newActividad);
            return savedActividad.id;
        } catch (error) {
            console.error("Error creating actividad: ", error);
            throw new Error("Failed to create actividad");
        }
    }

    async updateActividad(id: number, actividad: Partial<ActividadDomain>): Promise<boolean> {
        try {
            const existingActividad = await this.actividadRepository.findOne({ where: { id: id } });
            if (!existingActividad) return false;

            Object.assign(existingActividad, {
                usuario_id: actividad.usuario_id ?? existingActividad.usuario_id,
                accion: actividad.accion ?? existingActividad.accion,
                fecha: actividad.fecha ?? existingActividad.fecha
            });

            await this.actividadRepository.save(existingActividad);
            return true;
        } catch (error) {
            console.error("Error updating actividad:", error);
            throw new Error("Failed to update actividad");
        }
    }

    async deleteActividad(id: number): Promise<boolean> {
        try {
            const result = await this.actividadRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting actividad:", error);
            throw new Error("Failed to delete actividad");
        }
    }

    async getActividadById(id: number): Promise<ActividadDomain | null> {
        try {
            const existingActividad = await this.actividadRepository.findOne({ where: { id: id } });
            return existingActividad ? this.toDomain(existingActividad) : null;
        } catch (error) {
            console.error("Error fetching actividad by ID:", error);
            throw new Error("Failed to fetch actividad by ID");
        }
    }

    async getAllActividades(): Promise<ActividadDomain[]> {
        try {
            const actividades = await this.actividadRepository.find({ 
                order: { fecha: 'DESC' } 
            });
            return actividades.map(actividad => this.toDomain(actividad));
        } catch (error) {
            console.error("Error fetching all actividades:", error);
            throw new Error("Failed to fetch all actividades");
        }
    }

    async getActividadesByUsuario(usuarioId: number): Promise<ActividadDomain[]> {
        try {
            const actividades = await this.actividadRepository.find({ 
                where: { usuario_id: usuarioId },
                order: { fecha: 'DESC' }
            });
            return actividades.map(actividad => this.toDomain(actividad));
        } catch (error) {
            console.error("Error fetching actividades by usuario:", error);
            throw new Error("Failed to fetch actividades by usuario");
        }
    }

    async getActividadesByFecha(fecha: Date): Promise<ActividadDomain[]> {
        try {
            const actividades = await this.actividadRepository.find({ 
                where: { fecha: fecha },
                order: { fecha: 'DESC' }
            });
            return actividades.map(actividad => this.toDomain(actividad));
        } catch (error) {
            console.error("Error fetching actividades by fecha:", error);
            throw new Error("Failed to fetch actividades by fecha");
        }
    }

    async getActividadesRecientes(limit: number = 10): Promise<ActividadDomain[]> {
        try {
            const actividades = await this.actividadRepository.find({ 
                order: { fecha: 'DESC' },
                take: limit
            });
            return actividades.map(actividad => this.toDomain(actividad));
        } catch (error) {
            console.error("Error fetching actividades recientes:", error);
            throw new Error("Failed to fetch actividades recientes");
        }
    }
} 