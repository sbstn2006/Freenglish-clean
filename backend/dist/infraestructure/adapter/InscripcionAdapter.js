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
exports.InscripcionAdapter = void 0;
const Inscripcion_1 = require("../entities/Inscripcion");
const data_base_1 = require("../config/data-base");
class InscripcionAdapter {
    constructor() {
        this.inscripcionRepository = data_base_1.AppDataSource.getRepository(Inscripcion_1.Inscripcion);
    }
    // Transforma la entidad de infraestructura al modelo de dominio
    toDomain(inscripcion) {
        return {
            id: inscripcion.id,
            estudiante_id: inscripcion.estudiante_id,
            horario_id: inscripcion.horario_id,
            fecha_inscripcion: new Date(inscripcion.fecha_inscripcion),
            estado: inscripcion.estado
        };
    }
    // Transforma el modelo de dominio a la entidad de infraestructura
    toEntity(inscripcion) {
        const inscripcionEntity = new Inscripcion_1.Inscripcion();
        inscripcionEntity.estudiante_id = inscripcion.estudiante_id;
        inscripcionEntity.horario_id = inscripcion.horario_id;
        inscripcionEntity.fecha_inscripcion = inscripcion.fecha_inscripcion.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
        inscripcionEntity.estado = inscripcion.estado;
        return inscripcionEntity;
    }
    createInscripcion(inscripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newInscripcion = this.toEntity(inscripcion);
                const savedInscripcion = yield this.inscripcionRepository.save(newInscripcion);
                return savedInscripcion.id;
            }
            catch (error) {
                console.error("Error creating inscripcion: ", error);
                throw new Error("Failed to create inscripcion");
            }
        });
    }
    updateInscripcion(id, inscripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const existingInscripcion = yield this.inscripcionRepository.findOne({ where: { id: id } });
                if (!existingInscripcion)
                    return false;
                Object.assign(existingInscripcion, {
                    estudiante_id: (_a = inscripcion.estudiante_id) !== null && _a !== void 0 ? _a : existingInscripcion.estudiante_id,
                    horario_id: (_b = inscripcion.horario_id) !== null && _b !== void 0 ? _b : existingInscripcion.horario_id,
                    fecha_inscripcion: (_c = inscripcion.fecha_inscripcion) !== null && _c !== void 0 ? _c : existingInscripcion.fecha_inscripcion,
                    estado: (_d = inscripcion.estado) !== null && _d !== void 0 ? _d : existingInscripcion.estado
                });
                yield this.inscripcionRepository.save(existingInscripcion);
                return true;
            }
            catch (error) {
                console.error("Error updating inscripcion:", error);
                throw new Error("Failed to update inscripcion");
            }
        });
    }
    deleteInscripcion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.inscripcionRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting inscripcion:", error);
                throw new Error("Failed to delete inscripcion");
            }
        });
    }
    getInscripcionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingInscripcion = yield this.inscripcionRepository.findOne({ where: { id: id } });
                return existingInscripcion ? this.toDomain(existingInscripcion) : null;
            }
            catch (error) {
                console.error("Error fetching inscripcion by ID:", error);
                throw new Error("Failed to fetch inscripcion by ID");
            }
        });
    }
    getAllInscripciones() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inscripciones = yield this.inscripcionRepository.find();
                return inscripciones.map(inscripcion => this.toDomain(inscripcion));
            }
            catch (error) {
                console.error("Error fetching all inscripciones:", error);
                throw new Error("Failed to fetch all inscripciones");
            }
        });
    }
    getInscripcionesByEstudiante(estudianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inscripciones = yield this.inscripcionRepository.find({ where: { estudiante_id: estudianteId } });
                return inscripciones.map(inscripcion => this.toDomain(inscripcion));
            }
            catch (error) {
                console.error("Error fetching inscripciones by estudiante:", error);
                throw new Error("Failed to fetch inscripciones by estudiante");
            }
        });
    }
    getInscripcionesByHorario(horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inscripciones = yield this.inscripcionRepository.find({ where: { horario_id: horarioId } });
                return inscripciones.map(inscripcion => this.toDomain(inscripcion));
            }
            catch (error) {
                console.error("Error fetching inscripciones by horario:", error);
                throw new Error("Failed to fetch inscripciones by horario");
            }
        });
    }
    checkInscripcionExists(estudianteId, horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inscripcion = yield this.inscripcionRepository.findOne({
                    where: {
                        estudiante_id: estudianteId,
                        horario_id: horarioId
                    }
                });
                return !!inscripcion;
            }
            catch (error) {
                console.error("Error checking inscripcion exists:", error);
                throw new Error("Failed to check inscripcion exists");
            }
        });
    }
}
exports.InscripcionAdapter = InscripcionAdapter;
//# sourceMappingURL=InscripcionAdapter.js.map