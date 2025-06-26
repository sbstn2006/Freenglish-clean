import { AsistenciaPort } from "../../domain/AsistenciaPort";
import { Asistencia as AsistenciaEntitie } from "../entities/Asistencia";
import { Asistencia as AsistenciaDomain } from "../../domain/Asistencia";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class AsistenciaAdapter implements AsistenciaPort {
    private asistenciaRepository: Repository<AsistenciaEntitie>;

    constructor() {
        this.asistenciaRepository = AppDataSource.getRepository(AsistenciaEntitie);
    }

    // Transforma la entidad de infraestructura al modelo de dominio
    private toDomain(asistencia: AsistenciaEntitie): AsistenciaDomain {
        return {
            id: asistencia.id,
            estudiante_id: asistencia.estudiante_id,
            horario_id: asistencia.horario_id,
            fecha: new Date(asistencia.fecha),
            presente: asistencia.presente
        };
    }

    // Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(asistencia: Omit<AsistenciaDomain, "id">): AsistenciaEntitie {
        const asistenciaEntity = new AsistenciaEntitie();
        asistenciaEntity.estudiante_id = asistencia.estudiante_id;
        asistenciaEntity.horario_id = asistencia.horario_id;
        asistenciaEntity.fecha = asistencia.fecha.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
        asistenciaEntity.presente = asistencia.presente;
        return asistenciaEntity;
    }

    async createAsistencia(asistencia: Omit<AsistenciaDomain, "id">): Promise<number> {
        try {
            const newAsistencia = this.toEntity(asistencia);
            const savedAsistencia = await this.asistenciaRepository.save(newAsistencia);
            return savedAsistencia.id;
        } catch (error) {
            console.error("Error creating asistencia: ", error);
            throw new Error("Failed to create asistencia");
        }
    }

    async updateAsistencia(id: number, asistencia: Partial<AsistenciaDomain>): Promise<boolean> {
        try {
            const existingAsistencia = await this.asistenciaRepository.findOne({ where: { id: id } });
            if (!existingAsistencia) return false;

            Object.assign(existingAsistencia, {
                estudiante_id: asistencia.estudiante_id ?? existingAsistencia.estudiante_id,
                horario_id: asistencia.horario_id ?? existingAsistencia.horario_id,
                fecha: asistencia.fecha ?? existingAsistencia.fecha,
                presente: asistencia.presente ?? existingAsistencia.presente
            });

            await this.asistenciaRepository.save(existingAsistencia);
            return true;
        } catch (error) {
            console.error("Error updating asistencia:", error);
            throw new Error("Failed to update asistencia");
        }
    }

    async deleteAsistencia(id: number): Promise<boolean> {
        try {
            const result = await this.asistenciaRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting asistencia:", error);
            throw new Error("Failed to delete asistencia");
        }
    }

    async getAsistenciaById(id: number): Promise<AsistenciaDomain | null> {
        try {
            const existingAsistencia = await this.asistenciaRepository.findOne({ where: { id: id } });
            return existingAsistencia ? this.toDomain(existingAsistencia) : null;
        } catch (error) {
            console.error("Error fetching asistencia by ID:", error);
            throw new Error("Failed to fetch asistencia by ID");
        }
    }

    async getAllAsistencias(): Promise<AsistenciaDomain[]> {
        try {
            const asistencias = await this.asistenciaRepository.find();
            return asistencias.map(asistencia => this.toDomain(asistencia));
        } catch (error) {
            console.error("Error fetching all asistencias:", error);
            throw new Error("Failed to fetch all asistencias");
        }
    }

    async getAsistenciasByEstudiante(estudianteId: number): Promise<AsistenciaDomain[]> {
        try {
            const asistencias = await this.asistenciaRepository.find({ where: { estudiante_id: estudianteId } });
            return asistencias.map(asistencia => this.toDomain(asistencia));
        } catch (error) {
            console.error("Error fetching asistencias by estudiante:", error);
            throw new Error("Failed to fetch asistencias by estudiante");
        }
    }

    async getAsistenciasByHorario(horarioId: number): Promise<AsistenciaDomain[]> {
        try {
            const asistencias = await this.asistenciaRepository.find({ where: { horario_id: horarioId } });
            return asistencias.map(asistencia => this.toDomain(asistencia));
        } catch (error) {
            console.error("Error fetching asistencias by horario:", error);
            throw new Error("Failed to fetch asistencias by horario");
        }
    }

    async getAsistenciasByFecha(fecha: Date): Promise<AsistenciaDomain[]> {
        try {
            const fechaString = fecha.toISOString().split('T')[0];
            const asistencias = await this.asistenciaRepository.find({ where: { fecha: fechaString } });
            return asistencias.map(asistencia => this.toDomain(asistencia));
        } catch (error) {
            console.error("Error fetching asistencias by fecha:", error);
            throw new Error("Failed to fetch asistencias by fecha");
        }
    }

    async getAsistenciasByEstudianteAndHorario(estudianteId: number, horarioId: number): Promise<AsistenciaDomain[]> {
        try {
            const asistencias = await this.asistenciaRepository.find({ 
                where: { 
                    estudiante_id: estudianteId, 
                    horario_id: horarioId 
                } 
            });
            return asistencias.map(asistencia => this.toDomain(asistencia));
        } catch (error) {
            console.error("Error fetching asistencias by estudiante and horario:", error);
            throw new Error("Failed to fetch asistencias by estudiante and horario");
        }
    }

    async checkAsistenciaExists(estudianteId: number, horarioId: number, fecha: Date): Promise<boolean> {
        try {
            const fechaString = fecha.toISOString().split('T')[0];
            const asistencia = await this.asistenciaRepository.findOne({ 
                where: { 
                    estudiante_id: estudianteId, 
                    horario_id: horarioId,
                    fecha: fechaString
                } 
            });
            return !!asistencia;
        } catch (error) {
            console.error("Error checking asistencia exists:", error);
            throw new Error("Failed to check asistencia exists");
        }
    }
} 