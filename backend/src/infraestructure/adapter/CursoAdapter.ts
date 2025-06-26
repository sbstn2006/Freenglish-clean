import { CursoPort } from "../../domain/CursoPort";
import { Curso as CursoEntitie } from "../entities/Curso";
import { Curso as CursoDomain } from "../../domain/Curso";
import { Horario as HorarioEntitie } from "../entities/Horario";
import { User as UserEntitie } from "../entities/User";
import { AppDataSource } from "../config/data-base";
import { Repository } from "typeorm";

export class CursoAdapter implements CursoPort {
    private cursoRepository: Repository<CursoEntitie>;
    private horarioRepository: Repository<HorarioEntitie>;
    private userRepository: Repository<UserEntitie>;
    
    constructor() {
        this.cursoRepository = AppDataSource.getRepository(CursoEntitie);
        this.horarioRepository = AppDataSource.getRepository(HorarioEntitie);
        this.userRepository = AppDataSource.getRepository(UserEntitie);
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

    async getCursoByIdWithSchedules(id: number): Promise<any> {
        try {
            const curso = await this.cursoRepository.findOne({ where: { id: id } });
            if (!curso) return null;

            // Obtener horarios del curso
            const horarios = await this.horarioRepository.find({ 
                where: { curso_id: id, estado: 'activo' } 
            });

            // Obtener información de docentes para cada horario
            const schedulesWithTeachers = await Promise.all(
                horarios.map(async (horario) => {
                    const docente = await this.userRepository.findOne({ 
                        where: { id: horario.docente_id } 
                    });

                    // Contar estudiantes inscritos en este horario
                    const inscripciones = await AppDataSource
                        .getRepository('freenglish.inscripciones')
                        .count({ 
                            where: { 
                                horario_id: horario.id, 
                                estado: 'activa' 
                            } 
                        });

                    return {
                        id: horario.id,
                        teacher: docente?.name || 'Docente no asignado',
                        schedule: `${horario.dia_semana} ${horario.hora_inicio} - ${horario.hora_fin}`,
                        students: inscripciones,
                        maxStudents: horario.max_estudiantes
                    };
                })
            );

            // Generar información de aprendizaje basada en el nivel
            const learnings = this.generateLearningsByLevel(curso.nivel);

            return {
                ...this.toDomain(curso),
                schedules: schedulesWithTeachers,
                learnings: learnings
            };
        } catch (error) {
            console.error("Error fetching curso with schedules:", error);
            throw new Error("Failed to fetch curso with schedules");
        }
    }

    private generateLearningsByLevel(nivel: string): string[] {
        const learningsByLevel: { [key: string]: string[] } = {
            'A1': [
                'Saludos y presentaciones básicas',
                'Vocabulario esencial del día a día',
                'Gramática básica: presente simple',
                'Pronunciación de sonidos fundamentales',
                'Comprensión de textos simples',
                'Conversaciones básicas en situaciones cotidianas'
            ],
            'A2': [
                'Expresiones para viajes y turismo',
                'Gramática: presente continuo y pasado simple',
                'Vocabulario de trabajo y estudios',
                'Escritura de emails informales',
                'Comprensión de noticias simples',
                'Conversaciones sobre hobbies y preferencias'
            ],
            'B1': [
                'Expresiones para situaciones sociales',
                'Gramática: condicionales y futuro',
                'Vocabulario académico y profesional',
                'Escritura de textos argumentativos',
                'Comprensión de películas y series',
                'Debates sobre temas de actualidad'
            ],
            'B2': [
                'Expresiones idiomáticas y coloquiales',
                'Gramática avanzada: subjuntivo y pasivas',
                'Vocabulario técnico y especializado',
                'Escritura académica y profesional',
                'Comprensión de literatura y textos complejos',
                'Presentaciones y discursos formales'
            ],
            'C1': [
                'Expresiones sofisticadas y matices',
                'Gramática: estructuras complejas y variaciones',
                'Vocabulario de alto nivel y sinónimos',
                'Escritura creativa y análisis crítico',
                'Comprensión de textos especializados',
                'Negociaciones y discursos persuasivos'
            ],
            'C2': [
                'Dominio completo de expresiones nativas',
                'Gramática: variaciones dialectales y estilísticas',
                'Vocabulario de nivel nativo y jerga',
                'Escritura literaria y técnica avanzada',
                'Comprensión de cualquier tipo de texto',
                'Comunicación experta en cualquier contexto'
            ]
        };

        return learningsByLevel[nivel] || learningsByLevel['A1'];
    }
} 