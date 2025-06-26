import { Inscripcion } from './Inscripcion';

export interface InscripcionPort {
    createInscripcion(inscripcion: Omit<Inscripcion, "id">): Promise<number>;
    updateInscripcion(id: number, inscripcion: Partial<Inscripcion>): Promise<boolean>;
    deleteInscripcion(id: number): Promise<boolean>;
    getInscripcionById(id: number): Promise<Inscripcion | null>;
    getAllInscripciones(): Promise<Inscripcion[]>;
    getInscripcionesByEstudiante(estudianteId: number): Promise<Inscripcion[]>;
    getInscripcionesByHorario(horarioId: number): Promise<Inscripcion[]>;
    checkInscripcionExists(estudianteId: number, horarioId: number): Promise<boolean>;
} 