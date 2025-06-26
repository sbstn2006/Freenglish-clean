import { HorarioPort } from "../../domain/HorarioPort";
import { Horario as HorarioEntitie } from "../entities/Horario";
import { Horario as HorarioDomain } from "../../domain/Horario";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class HorarioAdapter implements HorarioPort {
    private horarioRepository: Repository<HorarioEntitie>;

    constructor() {
        this.horarioRepository = AppDataSource.getRepository(HorarioEntitie);
    }

    // Transforma la entidad de infraestructura al modelo de dominio
    private toDomain(horario: HorarioEntitie): HorarioDomain {
        return {
            id: horario.id,
            curso_id: horario.curso_id,
            docente_id: horario.docente_id,
            dia_semana: horario.dia_semana,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            max_estudiantes: horario.max_estudiantes,
            estado: horario.estado
        };
    }

    // Transforma el modelo de dominio a la entidad de infraestructura
    private toEntity(horario: Omit<HorarioDomain, "id">): HorarioEntitie {
        const horarioEntity = new HorarioEntitie();
        horarioEntity.curso_id = horario.curso_id;
        horarioEntity.docente_id = horario.docente_id;
        horarioEntity.dia_semana = horario.dia_semana;
        horarioEntity.hora_inicio = horario.hora_inicio;
        horarioEntity.hora_fin = horario.hora_fin;
        horarioEntity.max_estudiantes = horario.max_estudiantes;
        horarioEntity.estado = horario.estado;
        return horarioEntity;
    }

    async createHorario(horario: Omit<HorarioDomain, "id">): Promise<number> {
        try {
            const newHorario = this.toEntity(horario);
            const savedHorario = await this.horarioRepository.save(newHorario);
            return savedHorario.id;
        } catch (error) {
            console.error("Error creating horario: ", error);
            throw new Error("Failed to create horario");
        }
    }

    async updateHorario(id: number, horario: Partial<HorarioDomain>): Promise<boolean> {
        try {
            const existingHorario = await this.horarioRepository.findOne({ where: { id: id } });
            if (!existingHorario) return false;

            Object.assign(existingHorario, {
                curso_id: horario.curso_id ?? existingHorario.curso_id,
                docente_id: horario.docente_id ?? existingHorario.docente_id,
                dia_semana: horario.dia_semana ?? existingHorario.dia_semana,
                hora_inicio: horario.hora_inicio ?? existingHorario.hora_inicio,
                hora_fin: horario.hora_fin ?? existingHorario.hora_fin,
                max_estudiantes: horario.max_estudiantes ?? existingHorario.max_estudiantes,
                estado: horario.estado ?? existingHorario.estado
            });

            await this.horarioRepository.save(existingHorario);
            return true;
        } catch (error) {
            console.error("Error updating horario:", error);
            throw new Error("Failed to update horario");
        }
    }

    async deleteHorario(id: number): Promise<boolean> {
        try {
            const result = await this.horarioRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting horario:", error);
            throw new Error("Failed to delete horario");
        }
    }

    async getHorarioById(id: number): Promise<HorarioDomain | null> {
        try {
            const existingHorario = await this.horarioRepository.findOne({ where: { id: id } });
            return existingHorario ? this.toDomain(existingHorario) : null;
        } catch (error) {
            console.error("Error fetching horario by ID:", error);
            throw new Error("Failed to fetch horario by ID");
        }
    }

    async getAllHorarios(): Promise<HorarioDomain[]> {
        try {
            const horarios = await this.horarioRepository.find();
            return horarios.map(horario => this.toDomain(horario));
        } catch (error) {
            console.error("Error fetching all horarios:", error);
            throw new Error("Failed to fetch all horarios");
        }
    }

    async getHorariosByDocente(docenteId: number): Promise<HorarioDomain[]> {
        try {
            const horarios = await this.horarioRepository.find({ where: { docente_id: docenteId } });
            return horarios.map(horario => this.toDomain(horario));
        } catch (error) {
            console.error("Error fetching horarios by docente:", error);
            throw new Error("Failed to fetch horarios by docente");
        }
    }

    async getHorariosByCurso(cursoId: number): Promise<HorarioDomain[]> {
        try {
            const horarios = await this.horarioRepository.find({ where: { curso_id: cursoId } });
            return horarios.map(horario => this.toDomain(horario));
        } catch (error) {
            console.error("Error fetching horarios by curso:", error);
            throw new Error("Failed to fetch horarios by curso");
        }
    }
} 