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
exports.AsistenciaAdapter = void 0;
const Asistencia_1 = require("../entities/Asistencia");
const data_base_1 = require("../config/data-base");
class AsistenciaAdapter {
    constructor() {
        this.asistenciaRepository = data_base_1.AppDataSource.getRepository(Asistencia_1.Asistencia);
    }
    // Transforma la entidad de infraestructura al modelo de dominio
    toDomain(asistencia) {
        return {
            id: asistencia.id,
            estudiante_id: asistencia.estudiante_id,
            horario_id: asistencia.horario_id,
            fecha: new Date(asistencia.fecha),
            presente: asistencia.presente
        };
    }
    // Transforma el modelo de dominio a la entidad de infraestructura
    toEntity(asistencia) {
        const asistenciaEntity = new Asistencia_1.Asistencia();
        asistenciaEntity.estudiante_id = asistencia.estudiante_id;
        asistenciaEntity.horario_id = asistencia.horario_id;
        asistenciaEntity.fecha = asistencia.fecha.toISOString().split('T')[0]; // Convertir Date a string YYYY-MM-DD
        asistenciaEntity.presente = asistencia.presente;
        return asistenciaEntity;
    }
    createAsistencia(asistencia) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newAsistencia = this.toEntity(asistencia);
                const savedAsistencia = yield this.asistenciaRepository.save(newAsistencia);
                return savedAsistencia.id;
            }
            catch (error) {
                console.error("Error creating asistencia: ", error);
                throw new Error("Failed to create asistencia");
            }
        });
    }
    updateAsistencia(id, asistencia) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const existingAsistencia = yield this.asistenciaRepository.findOne({ where: { id: id } });
                if (!existingAsistencia)
                    return false;
                Object.assign(existingAsistencia, {
                    estudiante_id: (_a = asistencia.estudiante_id) !== null && _a !== void 0 ? _a : existingAsistencia.estudiante_id,
                    horario_id: (_b = asistencia.horario_id) !== null && _b !== void 0 ? _b : existingAsistencia.horario_id,
                    fecha: (_c = asistencia.fecha) !== null && _c !== void 0 ? _c : existingAsistencia.fecha,
                    presente: (_d = asistencia.presente) !== null && _d !== void 0 ? _d : existingAsistencia.presente
                });
                yield this.asistenciaRepository.save(existingAsistencia);
                return true;
            }
            catch (error) {
                console.error("Error updating asistencia:", error);
                throw new Error("Failed to update asistencia");
            }
        });
    }
    deleteAsistencia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.asistenciaRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting asistencia:", error);
                throw new Error("Failed to delete asistencia");
            }
        });
    }
    getAsistenciaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAsistencia = yield this.asistenciaRepository.findOne({ where: { id: id } });
                return existingAsistencia ? this.toDomain(existingAsistencia) : null;
            }
            catch (error) {
                console.error("Error fetching asistencia by ID:", error);
                throw new Error("Failed to fetch asistencia by ID");
            }
        });
    }
    getAllAsistencias() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencias = yield this.asistenciaRepository.find();
                return asistencias.map(asistencia => this.toDomain(asistencia));
            }
            catch (error) {
                console.error("Error fetching all asistencias:", error);
                throw new Error("Failed to fetch all asistencias");
            }
        });
    }
    getAsistenciasByEstudiante(estudianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencias = yield this.asistenciaRepository.find({ where: { estudiante_id: estudianteId } });
                return asistencias.map(asistencia => this.toDomain(asistencia));
            }
            catch (error) {
                console.error("Error fetching asistencias by estudiante:", error);
                throw new Error("Failed to fetch asistencias by estudiante");
            }
        });
    }
    getAsistenciasByHorario(horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencias = yield this.asistenciaRepository.find({ where: { horario_id: horarioId } });
                return asistencias.map(asistencia => this.toDomain(asistencia));
            }
            catch (error) {
                console.error("Error fetching asistencias by horario:", error);
                throw new Error("Failed to fetch asistencias by horario");
            }
        });
    }
    getAsistenciasByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechaString = fecha.toISOString().split('T')[0];
                const asistencias = yield this.asistenciaRepository.find({ where: { fecha: fechaString } });
                return asistencias.map(asistencia => this.toDomain(asistencia));
            }
            catch (error) {
                console.error("Error fetching asistencias by fecha:", error);
                throw new Error("Failed to fetch asistencias by fecha");
            }
        });
    }
    getAsistenciasByEstudianteAndHorario(estudianteId, horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencias = yield this.asistenciaRepository.find({
                    where: {
                        estudiante_id: estudianteId,
                        horario_id: horarioId
                    }
                });
                return asistencias.map(asistencia => this.toDomain(asistencia));
            }
            catch (error) {
                console.error("Error fetching asistencias by estudiante and horario:", error);
                throw new Error("Failed to fetch asistencias by estudiante and horario");
            }
        });
    }
    checkAsistenciaExists(estudianteId, horarioId, fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fechaString = fecha.toISOString().split('T')[0];
                const asistencia = yield this.asistenciaRepository.findOne({
                    where: {
                        estudiante_id: estudianteId,
                        horario_id: horarioId,
                        fecha: fechaString
                    }
                });
                return !!asistencia;
            }
            catch (error) {
                console.error("Error checking asistencia exists:", error);
                throw new Error("Failed to check asistencia exists");
            }
        });
    }
}
exports.AsistenciaAdapter = AsistenciaAdapter;
//# sourceMappingURL=AsistenciaAdapter.js.map