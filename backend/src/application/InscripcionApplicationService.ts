import { Inscripcion } from '../domain/Inscripcion';
import { InscripcionPort } from '../domain/InscripcionPort';

export class InscripcionApplicationService {
    private port: InscripcionPort;

    constructor(port: InscripcionPort) {
        this.port = port;
    }

    async createInscripcion(inscripcion: Omit<Inscripcion, "id">): Promise<number> {
        try {
            // Validaciones de negocio
            if (!inscripcion.estudiante_id || !inscripcion.horario_id) {
                throw new Error('estudiante_id y horario_id son requeridos');
            }

            // Verificar si ya existe una inscripción para este estudiante en este horario
            const existeInscripcion = await this.port.checkInscripcionExists(
                inscripcion.estudiante_id, 
                inscripcion.horario_id
            );

            if (existeInscripcion) {
                throw new Error('El estudiante ya está inscrito en este horario');
            }

            // Establecer fecha de inscripción si no se proporciona
            if (!inscripcion.fecha_inscripcion) {
                inscripcion.fecha_inscripcion = new Date();
            }

            // Establecer estado por defecto
            if (!inscripcion.estado) {
                inscripcion.estado = 'activa';
            }

            return await this.port.createInscripcion(inscripcion);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.createInscripcion:", error);
            throw error;
        }
    }

    async updateInscripcion(id: number, inscripcion: Partial<Inscripcion>): Promise<boolean> {
        try {
            const existingInscripcion = await this.port.getInscripcionById(id);
            if (!existingInscripcion) {
                throw new Error('Inscripcion not found');
            }

            // Validaciones de negocio para actualización
            if (inscripcion.estado && !['activa', 'cancelada', 'completada'].includes(inscripcion.estado)) {
                throw new Error('Estado de inscripción no válido');
            }

            return await this.port.updateInscripcion(id, inscripcion);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.updateInscripcion:", error);
            throw error;
        }
    }

    async deleteInscripcion(id: number): Promise<boolean> {
        try {
            return await this.port.deleteInscripcion(id);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.deleteInscripcion:", error);
            throw new Error("Failed to delete inscripcion");
        }
    }

    async getInscripcionById(id: number): Promise<Inscripcion | null> {
        try {
            return await this.port.getInscripcionById(id);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.getInscripcionById:", error);
            throw new Error("Failed to fetch inscripcion by ID");
        }
    }

    async getAllInscripciones(): Promise<Inscripcion[]> {
        try {
            return await this.port.getAllInscripciones();
        } catch (error) {
            console.error("Error in InscripcionApplicationService.getAllInscripciones:", error);
            throw new Error("Failed to fetch all inscripciones");
        }
    }

    async getInscripcionesByEstudiante(estudianteId: number): Promise<Inscripcion[]> {
        try {
            return await this.port.getInscripcionesByEstudiante(estudianteId);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.getInscripcionesByEstudiante:", error);
            throw new Error("Failed to fetch inscripciones by estudiante");
        }
    }

    async getInscripcionesByHorario(horarioId: number): Promise<Inscripcion[]> {
        try {
            return await this.port.getInscripcionesByHorario(horarioId);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.getInscripcionesByHorario:", error);
            throw new Error("Failed to fetch inscripciones by horario");
        }
    }

    async checkInscripcionExists(estudianteId: number, horarioId: number): Promise<boolean> {
        try {
            return await this.port.checkInscripcionExists(estudianteId, horarioId);
        } catch (error) {
            console.error("Error in InscripcionApplicationService.checkInscripcionExists:", error);
            throw new Error("Failed to check inscripcion exists");
        }
    }

    // Método de utilidad para cancelar inscripción
    async cancelarInscripcion(id: number): Promise<boolean> {
        try {
            return await this.updateInscripcion(id, { estado: 'cancelada' });
        } catch (error) {
            console.error("Error in InscripcionApplicationService.cancelarInscripcion:", error);
            throw error;
        }
    }

    // Método de utilidad para activar inscripción
    async activarInscripcion(id: number): Promise<boolean> {
        try {
            return await this.updateInscripcion(id, { estado: 'activa' });
        } catch (error) {
            console.error("Error in InscripcionApplicationService.activarInscripcion:", error);
            throw error;
        }
    }
} 