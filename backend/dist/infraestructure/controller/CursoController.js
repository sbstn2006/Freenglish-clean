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
    crearCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.app.crearCurso(req.body);
                return res.status(201).json({ id });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al crear curso" });
            }
        });
    }
    obtenerCursoPorId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const curso = yield this.app.obtenerCursoPorId(Number(req.params.id));
                if (!curso)
                    return res.status(404).json({ error: "Curso no encontrado" });
                return res.status(200).json(curso);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener curso" });
            }
        });
    }
    obtenerTodosLosCursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cursos = yield this.app.obtenerTodosLosCursos();
                return res.status(200).json(cursos);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener cursos" });
            }
        });
    }
    actualizarCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ok = yield this.app.actualizarCurso(Number(req.params.id), req.body);
                if (!ok)
                    return res.status(404).json({ error: "Curso no encontrado" });
                return res.status(200).json({ message: "Curso actualizado" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al actualizar curso" });
            }
        });
    }
    eliminarCurso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ok = yield this.app.eliminarCurso(Number(req.params.id));
                if (!ok)
                    return res.status(404).json({ error: "Curso no encontrado" });
                return res.status(200).json({ message: "Curso eliminado" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al eliminar curso" });
            }
        });
    }
}
exports.CursoController = CursoController;
//# sourceMappingURL=CursoController.js.map