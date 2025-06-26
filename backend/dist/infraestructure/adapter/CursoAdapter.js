"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursoAdapter = void 0;
const Curso_1 = require("../entities/Curso");
const Horario_1 = require("../entities/Horario");
const User_1 = require("../entities/User");
const data_base_1 = require("../config/data-base");
class CursoAdapter {
    constructor() {
        this.cursoRepository = data_base_1.AppDataSource.getRepository(Curso_1.Curso);
        this.horarioRepository = data_base_1.AppDataSource.getRepository(Horario_1.Horario);
        this.userRepository = data_base_1.AppDataSource.getRepository(User_1.User);
    }
    toDomain(curso) {
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
    toEntity(curso) {
        const cursoEntity = new Curso_1.Curso();
        cursoEntity.titulo = curso.titulo;
        cursoEntity.descripcion = curso.descripcion;
        cursoEntity.nivel = curso.nivel;
        cursoEntity.slug = curso.slug;
        cursoEntity.duracion = curso.duracion;
        cursoEntity.estado = curso.estado;
        return cursoEntity;
    }
    createCurso(curso) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCurso = this.toEntity(curso);
                const savedCurso = yield this.cursoRepository.save(newCurso);
                return savedCurso.id;
            }
            catch (error) {
                console.error("Error creating curso: ", error);
                throw new Error("Failed to create curso");
            }
        });
    }
    updateCurso(id, curso) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCurso = yield this.cursoRepository.findOne({ where: { id: id } });
                if (!existingCurso)
                    return false;
                Object.assign(existingCurso, curso);
                yield this.cursoRepository.save(existingCurso);
                return true;
            }
            catch (error) {
                console.error("Error updating curso:", error);
                throw new Error("Failed to update curso");
            }
        });
    }
    deleteCurso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.cursoRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting curso:", error);
                throw new Error("Failed to delete curso");
            }
        });
    }
    getCursoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const curso = yield this.cursoRepository.findOne({ where: { id: id } });
                return curso ? this.toDomain(curso) : null;
            }
            catch (error) {
                console.error("Error fetching curso by ID:", error);
                throw new Error("Failed to fetch curso by ID");
            }
        });
    }
    getAllCursos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cursos = yield this.cursoRepository.find();
                return cursos.map(curso => this.toDomain(curso));
            }
            catch (error) {
                console.error("Error fetching all cursos:", error);
                throw new Error("Failed to fetch all cursos");
            }
        });
    }
    getCursosByNivel(nivel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cursos = yield this.cursoRepository.find({ where: { nivel: nivel } });
                return cursos.map(curso => this.toDomain(curso));
            }
            catch (error) {
                console.error("Error fetching cursos by nivel:", error);
                throw new Error("Failed to fetch cursos by nivel");
            }
        });
    }
    getCursoByIdWithSchedules(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const curso = yield this.cursoRepository.findOne({ where: { id: id } });
                if (!curso)
                    return null;
                // Obtener horarios del curso
                const horarios = yield this.horarioRepository.find({
                    where: { curso_id: id, estado: 'activo' }
                });
                // Obtener información de docentes para cada horario
                const schedulesWithTeachers = yield Promise.all(horarios.map((horario) => __awaiter(this, void 0, void 0, function* () {
                    const docente = yield this.userRepository.findOne({
                        where: { id: horario.docente_id }
                    });
                    // Contar estudiantes inscritos en este horario
                    const inscripciones = yield data_base_1.AppDataSource
                        .getRepository('freenglish.inscripciones')
                        .count({
                        where: {
                            horario_id: horario.id,
                            estado: 'activa'
                        }
                    });
                    return {
                        id: horario.id,
                        teacher: (docente === null || docente === void 0 ? void 0 : docente.name) || 'Docente no asignado',
                        schedule: `${horario.dia_semana} ${horario.hora_inicio} - ${horario.hora_fin}`,
                        students: inscripciones,
                        maxStudents: horario.max_estudiantes
                    };
                })));
                // Generar información de aprendizaje basada en el nivel
                const learnings = this.generateLearningsByLevel(curso.nivel);
                return Object.assign(Object.assign({}, this.toDomain(curso)), { schedules: schedulesWithTeachers, learnings: learnings });
            }
            catch (error) {
                console.error("Error fetching curso with schedules:", error);
                throw new Error("Failed to fetch curso with schedules");
            }
        });
    }
    generateLearningsByLevel(nivel) {
        const learningsByLevel = {
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
exports.CursoAdapter = CursoAdapter;
//# sourceMappingURL=CursoAdapter.js.map