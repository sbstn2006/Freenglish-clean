import { CursoPort } from "../domain/CursoPort";
import { Curso } from "../domain/Curso";

export class CursoApplicationService {
    constructor(private cursoPort: CursoPort) {}

    async createCurso(curso: Omit<Curso, "id">): Promise<number> {
        return await this.cursoPort.createCurso(curso);
    }

    async updateCurso(id: number, curso: Partial<Curso>): Promise<boolean> {
        return await this.cursoPort.updateCurso(id, curso);
    }

    async deleteCurso(id: number): Promise<boolean> {
        return await this.cursoPort.deleteCurso(id);
    }

    async getCursoById(id: number): Promise<Curso | null> {
        return await this.cursoPort.getCursoById(id);
    }

    async getAllCursos(): Promise<Curso[]> {
        return await this.cursoPort.getAllCursos();
    }

    async getCursosByNivel(nivel: string): Promise<Curso[]> {
        return await this.cursoPort.getCursosByNivel(nivel);
    }
} 