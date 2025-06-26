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
exports.ActividadController = void 0;
class ActividadController {
    constructor(app) {
        this.app = app;
    }
    createActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario_id, accion } = req.body;
                if (!usuario_id || !accion) {
                    return res.status(400).json({ error: "usuario_id y accion son requeridos" });
                }
                const actividad = {
                    usuario_id,
                    accion,
                    fecha: new Date()
                };
                const actividadId = yield this.app.createActividad(actividad);
                return res.status(201).json({ message: "Actividad creada con éxito", actividadId });
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
    getActividadById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const actividad = yield this.app.getActividadById(id);
                if (!actividad)
                    return res.status(404).json({ error: "Actividad no encontrada" });
                return res.status(200).json(actividad);
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
    getAllActividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actividades = yield this.app.getAllActividades();
                return res.status(200).json(actividades);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener las actividades" });
            }
        });
    }
    getActividadesRecientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                const actividades = yield this.app.getActividadesRecientes(limit);
                return res.status(200).json(actividades);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener las actividades recientes" });
            }
        });
    }
    getActividadesByUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuarioId = parseInt(req.params.usuarioId);
                if (isNaN(usuarioId))
                    return res.status(400).json({ error: "ID de usuario inválido" });
                const actividades = yield this.app.getActividadesByUsuario(usuarioId);
                return res.status(200).json(actividades);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener las actividades del usuario" });
            }
        });
    }
    updateActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const { usuario_id, accion, fecha } = req.body;
                const updateData = {};
                if (usuario_id !== undefined)
                    updateData.usuario_id = usuario_id;
                if (accion !== undefined)
                    updateData.accion = accion;
                if (fecha !== undefined)
                    updateData.fecha = fecha;
                const updated = yield this.app.updateActividad(id, updateData);
                if (!updated)
                    return res.status(404).json({ error: "Actividad no encontrada o sin cambios" });
                return res.status(200).json({ message: "Actividad actualizada con éxito" });
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
    deleteActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const deleted = yield this.app.deleteActividad(id);
                if (!deleted)
                    return res.status(404).json({ error: "Actividad no encontrada" });
                return res.status(200).json({ message: "Actividad eliminada con éxito" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al eliminar la actividad" });
            }
        });
    }
}
exports.ActividadController = ActividadController;
//# sourceMappingURL=ActividadController.js.map