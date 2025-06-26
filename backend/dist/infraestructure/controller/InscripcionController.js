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
exports.InscripcionController = void 0;
const data_base_1 = require("../config/data-base");
const InscripcionAdapter_1 = require("../adapter/InscripcionAdapter");
const InscripcionApplicationService_1 = require("../../application/InscripcionApplicationService");
const inscripcionAdapter = new InscripcionAdapter_1.InscripcionAdapter();
const inscripcionAppService = new InscripcionApplicationService_1.InscripcionApplicationService(inscripcionAdapter);
class InscripcionController {
    getAllInscripciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inscripciones = yield inscripcionAppService.getAllInscripciones();
                res.json(inscripciones);
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener inscripciones' });
            }
        });
    }
    getInscripcionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const inscripcion = yield inscripcionAppService.getInscripcionById(id);
                if (!inscripcion)
                    return res.status(404).json({ error: 'Inscripción no encontrada' });
                res.json(inscripcion);
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener la inscripción' });
            }
        });
    }
    createInscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { estudiante_id, horario_id, fecha_inscripcion, estado } = req.body;
                const inscripcion = { estudiante_id, horario_id, fecha_inscripcion, estado };
                const id = yield inscripcionAppService.createInscripcion(inscripcion);
                res.status(201).json({ message: 'Inscripción creada', id });
            }
            catch (error) {
                res.status(500).json({ error: 'Error al crear la inscripción', details: error instanceof Error ? error.message : error });
            }
        });
    }
    updateInscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const updated = yield inscripcionAppService.updateInscripcion(id, req.body);
                if (!updated)
                    return res.status(404).json({ error: 'Inscripción no encontrada o sin cambios' });
                res.json({ message: 'Inscripción actualizada' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error al actualizar la inscripción', details: error instanceof Error ? error.message : error });
            }
        });
    }
    deleteInscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const deleted = yield inscripcionAppService.deleteInscripcion(id);
                if (!deleted)
                    return res.status(404).json({ error: 'Inscripción no encontrada' });
                res.json({ message: 'Inscripción eliminada' });
            }
            catch (error) {
                res.status(500).json({ error: 'Error al eliminar la inscripción', details: error instanceof Error ? error.message : error });
            }
        });
    }
    getAllInscripcionesEnriched(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield data_base_1.AppDataSource.query(`
        SELECT
          i.id AS inscripcion_id,
          i.fecha_inscripcion,
          e.id AS estudiante_id,
          e.nombre AS estudiante_nombre,
          e.email AS estudiante_email,
          c.id AS curso_id,
          c.titulo AS curso_titulo,
          d.id AS docente_id,
          d.nombre AS docente_nombre,
          d.email AS docente_email
        FROM freenglish.inscripciones i
        JOIN freenglish.usuarios e ON i.estudiante_id = e.id
        JOIN freenglish.horarios h ON i.horario_id = h.id
        JOIN freenglish.cursos c ON h.curso_id = c.id
        JOIN freenglish.usuarios d ON h.docente_id = d.id
        ORDER BY i.fecha_inscripcion DESC
      `);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error al obtener inscripciones' });
            }
        });
    }
}
exports.InscripcionController = InscripcionController;
//# sourceMappingURL=InscripcionController.js.map