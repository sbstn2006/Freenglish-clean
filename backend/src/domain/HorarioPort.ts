import { Horario } from './Horario';

export interface HorarioPort {
    createHorario(horario: Omit<Horario, "id">): Promise<number>;
    updateHorario(id: number, horario: Partial<Horario>): Promise<boolean>;
    deleteHorario(id: number): Promise<boolean>;
    getHorarioById(id: number): Promise<Horario | null>;
    getAllHorarios(): Promise<Horario[]>;
    getHorariosByDocente(docenteId: number): Promise<Horario[]>;
    getHorariosByCurso(cursoId: number): Promise<Horario[]>;
} 