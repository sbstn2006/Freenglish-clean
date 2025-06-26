import { Asistencia } from '../domain/Asistencia';
import { AsistenciaPort } from '../domain/AsistenciaPort';

export class AsistenciaApplicationService {
    private port: AsistenciaPort;

    constructor(port: AsistenciaPort) {
        this.port = port;
    }

    async createAsistencia(asistencia: Omit<Asistencia, "id">): Promise<number> {
        try {
            // Validaciones de negocio
            if (!asistencia.estudiante_id || !asistencia.horario_id || !asistencia.fecha) {
                throw new Error('estudiante_id, horario_id y fecha son requeridos');
            }

            // Verificar que la fecha no sea futura
            const fechaAsistencia = new Date(asistencia.fecha);
            const fechaActual = new Date();
            if (fechaAsistencia > fechaActual) {
                throw new Error('No se puede registrar asistencia para fechas futuras');
            }

            // Verificar si ya existe una asistencia para este estudiante en este horario y fecha
            const existeAsistencia = await this.port.checkAsistenciaExists(
                asistencia.estudiante_id, 
                asistencia.horario_id,
                fechaAsistencia
            );

            if (existeAsistencia) {
                throw new Error('Ya existe un registro de asistencia para este estudiante en esta fecha');
            }

            // Establecer presente por defecto si no se proporciona
            if (asistencia.presente === undefined) {
                asistencia.presente = true;
            }

            return await this.port.createAsistencia(asistencia);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.createAsistencia:", error);
            throw error;
        }
    }

    async updateAsistencia(id: number, asistencia: Partial<Asistencia>): Promise<boolean> {
        try {
            const existingAsistencia = await this.port.getAsistenciaById(id);
            if (!existingAsistencia) {
                throw new Error('Asistencia not found');
            }

            // Validaciones de negocio para actualización
            if (asistencia.fecha) {
                const fechaAsistencia = new Date(asistencia.fecha);
                const fechaActual = new Date();
                if (fechaAsistencia > fechaActual) {
                    throw new Error('No se puede actualizar asistencia para fechas futuras');
                }
            }

            return await this.port.updateAsistencia(id, asistencia);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.updateAsistencia:", error);
            throw error;
        }
    }

    async deleteAsistencia(id: number): Promise<boolean> {
        try {
            return await this.port.deleteAsistencia(id);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.deleteAsistencia:", error);
            throw new Error("Failed to delete asistencia");
        }
    }

    async getAsistenciaById(id: number): Promise<Asistencia | null> {
        try {
            return await this.port.getAsistenciaById(id);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAsistenciaById:", error);
            throw new Error("Failed to fetch asistencia by ID");
        }
    }

    async getAllAsistencias(): Promise<Asistencia[]> {
        try {
            return await this.port.getAllAsistencias();
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAllAsistencias:", error);
            throw new Error("Failed to fetch all asistencias");
        }
    }

    async getAsistenciasByEstudiante(estudianteId: number): Promise<Asistencia[]> {
        try {
            return await this.port.getAsistenciasByEstudiante(estudianteId);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAsistenciasByEstudiante:", error);
            throw new Error("Failed to fetch asistencias by estudiante");
        }
    }

    async getAsistenciasByHorario(horarioId: number): Promise<Asistencia[]> {
        try {
            return await this.port.getAsistenciasByHorario(horarioId);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAsistenciasByHorario:", error);
            throw new Error("Failed to fetch asistencias by horario");
        }
    }

    async getAsistenciasByFecha(fecha: Date): Promise<Asistencia[]> {
        try {
            return await this.port.getAsistenciasByFecha(fecha);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAsistenciasByFecha:", error);
            throw new Error("Failed to fetch asistencias by fecha");
        }
    }

    async getAsistenciasByEstudianteAndHorario(estudianteId: number, horarioId: number): Promise<Asistencia[]> {
        try {
            return await this.port.getAsistenciasByEstudianteAndHorario(estudianteId, horarioId);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.getAsistenciasByEstudianteAndHorario:", error);
            throw new Error("Failed to fetch asistencias by estudiante and horario");
        }
    }

    async checkAsistenciaExists(estudianteId: number, horarioId: number, fecha: Date): Promise<boolean> {
        try {
            return await this.port.checkAsistenciaExists(estudianteId, horarioId, fecha);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.checkAsistenciaExists:", error);
            throw new Error("Failed to check asistencia exists");
        }
    }

    // Método de utilidad para marcar asistencia
    async marcarAsistencia(estudianteId: number, horarioId: number, fecha: Date, presente: boolean = true): Promise<number> {
        try {
            const asistencia: Omit<Asistencia, "id"> = {
                estudiante_id: estudianteId,
                horario_id: horarioId,
                fecha: fecha,
                presente: presente
            };
            return await this.port.createAsistencia(asistencia);
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.marcarAsistencia:", error);
            throw error;
        }
    }

    // Método de utilidad para calcular porcentaje de asistencia
    async calcularPorcentajeAsistencia(estudianteId: number, horarioId: number): Promise<number> {
        try {
            const asistencias = await this.getAsistenciasByEstudianteAndHorario(estudianteId, horarioId);
            if (asistencias.length === 0) return 0;

            const asistenciasPresentes = asistencias.filter(a => a.presente).length;
            return (asistenciasPresentes / asistencias.length) * 100;
        } catch (error) {
            console.error("Error in AsistenciaApplicationService.calcularPorcentajeAsistencia:", error);
            throw new Error("Failed to calculate attendance percentage");
        }
    }
} 