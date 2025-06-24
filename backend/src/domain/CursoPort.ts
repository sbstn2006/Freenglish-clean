import { Curso } from "./Curso";

export interface CursoPort {
    createCurso(curso: Omit<Curso, "id">): Promise<number>;
    updateCurso(id: number, curso: Partial<Curso>): Promise<boolean>;
    deleteCurso(id: number): Promise<boolean>;
    getCursoById(id: number): Promise<Curso | null>;
    getAllCursos(): Promise<Curso[]>;
    getCursosByNivel(nivel: string): Promise<Curso[]>;
} 