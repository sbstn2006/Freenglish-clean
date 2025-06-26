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
exports.CursoController = void 0;
class CursoController {
    constructor(app) {
        this.app = app;
    }
    createCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, descripcion, nivel, slug, duracion, docente_id } = req.body;
                // Validaciones
                if (!titulo || titulo.trim().length < 3) {
                    return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
                }
                if (!descripcion || descripcion.trim().length < 10) {
                    return res.status(400).json({ error: "La descripción debe tener al menos 10 caracteres" });
                }
                if (!nivel || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                    return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
                }
                if (!slug || slug.trim().length < 3) {
                    return res.status(400).json({ error: "El slug debe tener al menos 3 caracteres" });
                }
                if (!duracion || duracion.trim().length < 2) {
                    return res.status(400).json({ error: "La duración debe tener al menos 2 caracteres" });
                }
                const curso = {
                    titulo: titulo.trim(),
                    descripcion: descripcion.trim(),
                    nivel,
                    slug: slug.trim(),
                    duracion: duracion.trim(),
                    estado: "activo"
                };
                const cursoId = yield this.app.createCurso(curso);
                // Registrar actividad
                if (docente_id) {
                    yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                        usuario_id: docente_id,
                        accion: `Creó el curso ${titulo}`,
                        fecha: new Date()
                    });
                }
                return res.status(201).json({
                    message: "Curso creado con éxito",
                    cursoId
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getCursoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                }
                const curso = yield this.app.getCursoById(id);
                if (!curso) {
                    return res.status(404).json({ error: "Curso no encontrado" });
                }
                return res.status(200).json(curso);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getCursoByIdWithSchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                }
                const curso = yield this.app.getCursoByIdWithSchedules(id);
                if (!curso) {
                    return res.status(404).json({ error: "Curso no encontrado" });
                }
                return res.status(200).json(curso);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getAllCursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cursos = yield this.app.getAllCursos();
                return res.status(200).json(cursos);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los cursos" });
            }
        });
    }
    getCursosByNivel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nivel } = req.params;
                if (!nivel || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                    return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
                }
                const cursos = yield this.app.getCursosByNivel(nivel);
                return res.status(200).json(cursos);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los cursos por nivel" });
            }
        });
    }
    updateCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                }
                const { titulo, descripcion, nivel, slug, duracion, estado, docente_id } = req.body;
                // Validaciones para campos opcionales
                if (titulo && titulo.trim().length < 3) {
                    return res.status(400).json({ error: "El título debe tener al menos 3 caracteres" });
                }
                if (descripcion && descripcion.trim().length < 10) {
                    return res.status(400).json({ error: "La descripción debe tener al menos 10 caracteres" });
                }
                if (nivel && !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(nivel)) {
                    return res.status(400).json({ error: "Nivel debe ser A1, A2, B1, B2, C1 o C2" });
                }
                if (slug && slug.trim().length < 3) {
                    return res.status(400).json({ error: "El slug debe tener al menos 3 caracteres" });
                }
                if (duracion && duracion.trim().length < 2) {
                    return res.status(400).json({ error: "La duración debe tener al menos 2 caracteres" });
                }
                const updated = yield this.app.updateCurso(id, {
                    titulo: titulo === null || titulo === void 0 ? void 0 : titulo.trim(),
                    descripcion: descripcion === null || descripcion === void 0 ? void 0 : descripcion.trim(),
                    nivel,
                    slug: slug === null || slug === void 0 ? void 0 : slug.trim(),
                    duracion: duracion === null || duracion === void 0 ? void 0 : duracion.trim(),
                    estado
                });
                if (!updated) {
                    return res.status(404).json({ error: "Curso no encontrado o sin cambios" });
                }
                // Registrar actividad
                if (docente_id) {
                    yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                        usuario_id: docente_id,
                        accion: `Editó el curso ${titulo || '(ID ' + id + ')'}`,
                        fecha: new Date()
                    });
                }
                return res.status(200).json({ message: "Curso actualizado con éxito" });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    deleteCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                }
                const { docente_id } = req.body;
                const deleted = yield this.app.deleteCurso(id);
                if (!deleted) {
                    return res.status(404).json({ error: "Curso no encontrado" });
                }
                // Registrar actividad
                if (docente_id) {
                    yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                        usuario_id: docente_id,
                        accion: `Eliminó el curso (ID ${id})`,
                        fecha: new Date()
                    });
                }
                return res.status(200).json({ message: "Curso eliminado con éxito" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al eliminar el curso" });
            }
        });
    }
}
exports.CursoController = CursoController;
//# sourceMappingURL=CursoController.js.map