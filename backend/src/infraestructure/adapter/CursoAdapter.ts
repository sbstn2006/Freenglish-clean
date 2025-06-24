import { CursoPort } from "../../domain/CursoPort";
import { Curso as CursoEntitie } from "../entities/Curso";
import { Curso as CursoDomain } from "../../domain/Curso";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class CursoAdapter implements CursoPort {
    private cursoRepository: Repository<CursoEntitie>;
    
    constructor() {
        this.cursoRepository = AppDataSource.getRepository(CursoEntitie);
    }

    private toDomain(curso: CursoEntitie): CursoDomain {
        return {
            id: curso.id,
            titulo: curso.titulo,
            descripcion: curso.descripcion,
            nivel: curso.nivel,
            slug: curso.slug,
            duracion: curso.duracion,
            estado: curso.estado
        };
    }

    private toEntity(curso: Omit<CursoDomain, "id">): CursoEntitie {
        const cursoEntity = new CursoEntitie();
        cursoEntity.titulo = curso.titulo;
        cursoEntity.descripcion = curso.descripcion;
        cursoEntity.nivel = curso.nivel;
        cursoEntity.slug = curso.slug;
        cursoEntity.duracion = curso.duracion;
        cursoEntity.estado = curso.estado;
        return cursoEntity;
    }

    async createCurso(curso: Omit<CursoDomain, "id">): Promise<number> {
        try {
            const newCurso = this.toEntity(curso);
            const savedCurso = await this.cursoRepository.save(newCurso);
            return savedCurso.id;
        } catch (error) {
            console.error("Error creating curso: ", error);
            throw new Error("Failed to create curso");
        }
    }

    async updateCurso(id: number, curso: Partial<CursoDomain>): Promise<boolean> {
        try {
            const existingCurso = await this.cursoRepository.findOne({ where: { id: id } });
            if (!existingCurso) return false;
            
            Object.assign(existingCurso, curso);
            await this.cursoRepository.save(existingCurso);
            return true;
        } catch (error) {
            console.error("Error updating curso:", error);
            throw new Error("Failed to update curso");
        }
    }

    async deleteCurso(id: number): Promise<boolean> {
        try {
            const result = await this.cursoRepository.delete(id);
            return result.affected ? result.affected > 0 : false;
        } catch (error) {
            console.error("Error deleting curso:", error);
            throw new Error("Failed to delete curso");
        }
    }

    async getCursoById(id: number): Promise<CursoDomain | null> {
        try {
            const curso = await this.cursoRepository.findOne({ where: { id: id } });
            return curso ? this.toDomain(curso) : null;
        } catch (error) {
            console.error("Error fetching curso by ID:", error);
            throw new Error("Failed to fetch curso by ID");
        }
    }

    async getAllCursos(): Promise<CursoDomain[]> {
        try {
            const cursos = await this.cursoRepository.find();
            return cursos.map(curso => this.toDomain(curso));
        } catch (error) {
            console.error("Error fetching all cursos:", error);
            throw new Error("Failed to fetch all cursos");
        }
    }

    async getCursosByNivel(nivel: string): Promise<CursoDomain[]> {
        try {
            const cursos = await this.cursoRepository.find({ where: { nivel: nivel } });
            return cursos.map(curso => this.toDomain(curso));
        } catch (error) {
            console.error("Error fetching cursos by nivel:", error);
            throw new Error("Failed to fetch cursos by nivel");
        }
    }
} 