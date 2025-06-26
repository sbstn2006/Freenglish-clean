import { Horario } from '../domain/Horario';
import { HorarioPort } from '../domain/HorarioPort';

export class HorarioApplicationService {
    private port: HorarioPort;

    constructor(port: HorarioPort) {
        this.port = port;
    }

    async createHorario(horario: Omit<Horario, "id">): Promise<number> {
        try {
            // Validaciones de negocio
            if (horario.hora_inicio >= horario.hora_fin) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }

            if (horario.max_estudiantes <= 0) {
                throw new Error('El número máximo de estudiantes debe ser mayor a 0');
            }

            const diasValidos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
            if (!diasValidos.includes(horario.dia_semana.toLowerCase())) {
                throw new Error('Día de la semana no válido');
            }

            return await this.port.createHorario(horario);
        } catch (error) {
            console.error("Error in HorarioApplicationService.createHorario:", error);
            throw error;
        }
    }

    async updateHorario(id: number, horario: Partial<Horario>): Promise<boolean> {
        try {
            const existingHorario = await this.port.getHorarioById(id);
            if (!existingHorario) {
                throw new Error('Horario not found');
            }

            // Validaciones de negocio para actualización
            if (horario.hora_inicio && horario.hora_fin && horario.hora_inicio >= horario.hora_fin) {
                throw new Error('La hora de inicio debe ser anterior a la hora de fin');
            }

            if (horario.max_estudiantes !== undefined && horario.max_estudiantes <= 0) {
                throw new Error('El número máximo de estudiantes debe ser mayor a 0');
            }

            if (horario.dia_semana) {
                const diasValidos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
                if (!diasValidos.includes(horario.dia_semana.toLowerCase())) {
                    throw new Error('Día de la semana no válido');
                }
            }

            return await this.port.updateHorario(id, horario);
        } catch (error) {
            console.error("Error in HorarioApplicationService.updateHorario:", error);
            throw error;
        }
    }

    async deleteHorario(id: number): Promise<boolean> {
        try {
            return await this.port.deleteHorario(id);
        } catch (error) {
            console.error("Error in HorarioApplicationService.deleteHorario:", error);
            throw new Error("Failed to delete horario");
        }
    }

    async getHorarioById(id: number): Promise<Horario | null> {
        try {
            return await this.port.getHorarioById(id);
        } catch (error) {
            console.error("Error in HorarioApplicationService.getHorarioById:", error);
            throw new Error("Failed to fetch horario by ID");
        }
    }

    async getAllHorarios(): Promise<Horario[]> {
        try {
            return await this.port.getAllHorarios();
        } catch (error) {
            console.error("Error in HorarioApplicationService.getAllHorarios:", error);
            throw new Error("Failed to fetch all horarios");
        }
    }

    async getHorariosByDocente(docenteId: number): Promise<Horario[]> {
        try {
            return await this.port.getHorariosByDocente(docenteId);
        } catch (error) {
            console.error("Error in HorarioApplicationService.getHorariosByDocente:", error);
            throw new Error("Failed to fetch horarios by docente");
        }
    }

    async getHorariosByCurso(cursoId: number): Promise<Horario[]> {
        try {
            return await this.port.getHorariosByCurso(cursoId);
        } catch (error) {
            console.error("Error in HorarioApplicationService.getHorariosByCurso:", error);
            throw new Error("Failed to fetch horarios by curso");
        }
    }
} 