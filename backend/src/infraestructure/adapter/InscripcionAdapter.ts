import { InscripcionPort } from "../../domain/InscripcionPort";
import { Inscripcion as InscripcionEntitie } from "../entities/Inscripcion";
import { Inscripcion as InscripcionDomain } from "../../domain/Inscripcion";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class InscripcionAdapter implements InscripcionPort {
    private inscripcionRepository: Repository<InscripcionEntitie>;

    constructor() {
        this.inscripcionRepository = AppDataSource.getRepository(InscripcionEntitie);
    }

    // Transforma la entidad de infraestructura al modelo de dominio
    private toDomain(inscripcion: InscripcionEntitie): InscripcionDomain {
        return {
            id: inscripcion.id,
            estudiante_id: inscripcion.estudiante_id,
            horario_id: inscripcion.horario_id,
            fecha_inscripcion: new Date(inscripcion.fecha_inscripcion),
            estado: inscripcion.estado
        };
    }

    // Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(inscripcion: Omit<InscripcionDomain, "id">): InscripcionEntitie {
        const inscripcionEntity = new InscripcionEntitie();
        inscripcionEntity.estudiante_id = inscripcion.estudiante_id;
        inscripcionEntity.horario_id = inscripcion.horario_id;
        inscripcionEntity.fecha_inscripcion = inscripcion.fecha_inscripcion.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
        inscripcionEntity.estado = inscripcion.estado;
        return inscripcionEntity;
    }

    async createInscripcion(inscripcion: Omit<InscripcionDomain, "id">): Promise<number> {
        try {
            const newInscripcion = this.toEntity(inscripcion);
            const savedInscripcion = await this.inscripcionRepository.save(newInscripcion);
            return savedInscripcion.id;
        } catch (error) {
            console.error("Error creating inscripcion: ", error);
            throw new Error("Failed to create inscripcion");
        }
    }

    async updateInscripcion(id: number, inscripcion: Partial<InscripcionDomain>): Promise<boolean> {
        try {
            const existingInscripcion = await this.inscripcionRepository.findOne({ where: { id: id } });
            if (!existingInscripcion) return false;

            Object.assign(existingInscripcion, {
                estudiante_id: inscripcion.estudiante_id ?? existingInscripcion.estudiante_id,
                horario_id: inscripcion.horario_id ?? existingInscripcion.horario_id,
                fecha_inscripcion: inscripcion.fecha_inscripcion ?? existingInscripcion.fecha_inscripcion,
                estado: inscripcion.estado ?? existingInscripcion.estado
            });

            await this.inscripcionRepository.save(existingInscripcion);
            return true;
        } catch (error) {
            console.error("Error updating inscripcion:", error);
            throw new Error("Failed to update inscripcion");
        }
    }

    async deleteInscripcion(id: number): Promise<boolean> {
        try {
            const result = await this.inscripcionRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting inscripcion:", error);
            throw new Error("Failed to delete inscripcion");
        }
    }

    async getInscripcionById(id: number): Promise<InscripcionDomain | null> {
        try {
            const existingInscripcion = await this.inscripcionRepository.findOne({ where: { id: id } });
            return existingInscripcion ? this.toDomain(existingInscripcion) : null;
        } catch (error) {
            console.error("Error fetching inscripcion by ID:", error);
            throw new Error("Failed to fetch inscripcion by ID");
        }
    }

    async getAllInscripciones(): Promise<InscripcionDomain[]> {
        try {
            const inscripciones = await this.inscripcionRepository.find();
            return inscripciones.map(inscripcion => this.toDomain(inscripcion));
        } catch (error) {
            console.error("Error fetching all inscripciones:", error);
            throw new Error("Failed to fetch all inscripciones");
        }
    }

    async getInscripcionesByEstudiante(estudianteId: number): Promise<InscripcionDomain[]> {
        try {
            const inscripciones = await this.inscripcionRepository.find({ where: { estudiante_id: estudianteId } });
            return inscripciones.map(inscripcion => this.toDomain(inscripcion));
        } catch (error) {
            console.error("Error fetching inscripciones by estudiante:", error);
            throw new Error("Failed to fetch inscripciones by estudiante");
        }
    }

    async getInscripcionesByHorario(horarioId: number): Promise<InscripcionDomain[]> {
        try {
            const inscripciones = await this.inscripcionRepository.find({ where: { horario_id: horarioId } });
            return inscripciones.map(inscripcion => this.toDomain(inscripcion));
        } catch (error) {
            console.error("Error fetching inscripciones by horario:", error);
            throw new Error("Failed to fetch inscripciones by horario");
        }
    }

    async checkInscripcionExists(estudianteId: number, horarioId: number): Promise<boolean> {
        try {
            const inscripcion = await this.inscripcionRepository.findOne({ 
                where: { 
                    estudiante_id: estudianteId, 
                    horario_id: horarioId 
                } 
            });
            return !!inscripcion;
        } catch (error) {
            console.error("Error checking inscripcion exists:", error);
            throw new Error("Failed to check inscripcion exists");
        }
    }
} 