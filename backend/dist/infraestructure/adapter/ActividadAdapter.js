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
exports.ActividadAdapter = void 0;
const ActividadReciente_1 = require("../entities/ActividadReciente");
const data_base_1 = require("../config/data-base");
class ActividadAdapter {
    constructor() {
        this.actividadRepository = data_base_1.AppDataSource.getRepository(ActividadReciente_1.ActividadReciente);
    }
    // Transforma la entidad de infraestructura al modelo de dominio
    toDomain(actividad) {
        return {
            id: actividad.id,
            usuario_id: actividad.usuario_id,
            accion: actividad.accion,
            fecha: actividad.fecha
        };
    }
    // Transforma el modelo de dominio a la entidad de infraestructura
    toEntity(actividad) {
        const actividadEntity = new ActividadReciente_1.ActividadReciente();
        actividadEntity.usuario_id = actividad.usuario_id;
        actividadEntity.accion = actividad.accion;
        actividadEntity.fecha = actividad.fecha;
        return actividadEntity;
    }
    createActividad(actividad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newActividad = this.toEntity(actividad);
                const savedActividad = yield this.actividadRepository.save(newActividad);
                return savedActividad.id;
            }
            catch (error) {
                console.error("Error creating actividad: ", error);
                throw new Error("Failed to create actividad");
            }
        });
    }
    updateActividad(id, actividad) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const existingActividad = yield this.actividadRepository.findOne({ where: { id: id } });
                if (!existingActividad)
                    return false;
                Object.assign(existingActividad, {
                    usuario_id: (_a = actividad.usuario_id) !== null && _a !== void 0 ? _a : existingActividad.usuario_id,
                    accion: (_b = actividad.accion) !== null && _b !== void 0 ? _b : existingActividad.accion,
                    fecha: (_c = actividad.fecha) !== null && _c !== void 0 ? _c : existingActividad.fecha
                });
                yield this.actividadRepository.save(existingActividad);
                return true;
            }
            catch (error) {
                console.error("Error updating actividad:", error);
                throw new Error("Failed to update actividad");
            }
        });
    }
    deleteActividad(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.actividadRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting actividad:", error);
                throw new Error("Failed to delete actividad");
            }
        });
    }
    getActividadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingActividad = yield this.actividadRepository.findOne({ where: { id: id } });
                return existingActividad ? this.toDomain(existingActividad) : null;
            }
            catch (error) {
                console.error("Error fetching actividad by ID:", error);
                throw new Error("Failed to fetch actividad by ID");
            }
        });
    }
    getAllActividades() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actividades = yield this.actividadRepository.find({
                    order: { fecha: 'DESC' }
                });
                return actividades.map(actividad => this.toDomain(actividad));
            }
            catch (error) {
                console.error("Error fetching all actividades:", error);
                throw new Error("Failed to fetch all actividades");
            }
        });
    }
    getActividadesByUsuario(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actividades = yield this.actividadRepository.find({
                    where: { usuario_id: usuarioId },
                    order: { fecha: 'DESC' }
                });
                return actividades.map(actividad => this.toDomain(actividad));
            }
            catch (error) {
                console.error("Error fetching actividades by usuario:", error);
                throw new Error("Failed to fetch actividades by usuario");
            }
        });
    }
    getActividadesByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actividades = yield this.actividadRepository.find({
                    where: { fecha: fecha },
                    order: { fecha: 'DESC' }
                });
                return actividades.map(actividad => this.toDomain(actividad));
            }
            catch (error) {
                console.error("Error fetching actividades by fecha:", error);
                throw new Error("Failed to fetch actividades by fecha");
            }
        });
    }
    getActividadesRecientes() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                const actividades = yield this.actividadRepository.find({
                    order: { fecha: 'DESC' },
                    take: limit
                });
                return actividades.map(actividad => this.toDomain(actividad));
            }
            catch (error) {
                console.error("Error fetching actividades recientes:", error);
                throw new Error("Failed to fetch actividades recientes");
            }
        });
    }
}
exports.ActividadAdapter = ActividadAdapter;
//# sourceMappingURL=ActividadAdapter.js.map