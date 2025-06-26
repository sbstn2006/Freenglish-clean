import { Asistencia } from './Asistencia';

export interface AsistenciaPort {
    createAsistencia(asistencia: Omit<Asistencia, "id">): Promise<number>;
    updateAsistencia(id: number, asistencia: Partial<Asistencia>): Promise<boolean>;
    deleteAsistencia(id: number): Promise<boolean>;
    getAsistenciaById(id: number): Promise<Asistencia | null>;
    getAllAsistencias(): Promise<Asistencia[]>;
    getAsistenciasByEstudiante(estudianteId: number): Promise<Asistencia[]>;
    getAsistenciasByHorario(horarioId: number): Promise<Asistencia[]>;
    getAsistenciasByFecha(fecha: Date): Promise<Asistencia[]>;
    getAsistenciasByEstudianteAndHorario(estudianteId: number, horarioId: number): Promise<Asistencia[]>;
    checkAsistenciaExists(estudianteId: number, horarioId: number, fecha: Date): Promise<boolean>;
} 