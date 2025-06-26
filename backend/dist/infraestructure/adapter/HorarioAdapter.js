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
exports.HorarioAdapter = void 0;
const Horario_1 = require("../entities/Horario");
const data_base_1 = require("../config/data-base");
class HorarioAdapter {
    constructor() {
        this.horarioRepository = data_base_1.AppDataSource.getRepository(Horario_1.Horario);
    }
    // Transforma la entidad de infraestructura al modelo de dominio
    toDomain(horario) {
        return {
            id: horario.id,
            curso_id: horario.curso_id,
            docente_id: horario.docente_id,
            dia_semana: horario.dia_semana,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
            max_estudiantes: horario.max_estudiantes,
            estado: horario.estado
        };
    }
    // Transforma el modelo de dominio a la entidad de infraestructura
    toEntity(horario) {
        const horarioEntity = new Horario_1.Horario();
        horarioEntity.curso_id = horario.curso_id;
        horarioEntity.docente_id = horario.docente_id;
        horarioEntity.dia_semana = horario.dia_semana;
        horarioEntity.hora_inicio = horario.hora_inicio;
        horarioEntity.hora_fin = horario.hora_fin;
        horarioEntity.max_estudiantes = horario.max_estudiantes;
        horarioEntity.estado = horario.estado;
        return horarioEntity;
    }
    createHorario(horario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newHorario = this.toEntity(horario);
                const savedHorario = yield this.horarioRepository.save(newHorario);
                return savedHorario.id;
            }
            catch (error) {
                console.error("Error creating horario: ", error);
                throw new Error("Failed to create horario");
            }
        });
    }
    updateHorario(id, horario) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const existingHorario = yield this.horarioRepository.findOne({ where: { id: id } });
                if (!existingHorario)
                    return false;
                Object.assign(existingHorario, {
                    curso_id: (_a = horario.curso_id) !== null && _a !== void 0 ? _a : existingHorario.curso_id,
                    docente_id: (_b = horario.docente_id) !== null && _b !== void 0 ? _b : existingHorario.docente_id,
                    dia_semana: (_c = horario.dia_semana) !== null && _c !== void 0 ? _c : existingHorario.dia_semana,
                    hora_inicio: (_d = horario.hora_inicio) !== null && _d !== void 0 ? _d : existingHorario.hora_inicio,
                    hora_fin: (_e = horario.hora_fin) !== null && _e !== void 0 ? _e : existingHorario.hora_fin,
                    max_estudiantes: (_f = horario.max_estudiantes) !== null && _f !== void 0 ? _f : existingHorario.max_estudiantes,
                    estado: (_g = horario.estado) !== null && _g !== void 0 ? _g : existingHorario.estado
                });
                yield this.horarioRepository.save(existingHorario);
                return true;
            }
            catch (error) {
                console.error("Error updating horario:", error);
                throw new Error("Failed to update horario");
            }
        });
    }
    deleteHorario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.horarioRepository.delete(id);
                return result.affected ? result.affected > 0 : false;
            }
            catch (error) {
                console.error("Error deleting horario:", error);
                throw new Error("Failed to delete horario");
            }
        });
    }
    getHorarioById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingHorario = yield this.horarioRepository.findOne({ where: { id: id } });
                return existingHorario ? this.toDomain(existingHorario) : null;
            }
            catch (error) {
                console.error("Error fetching horario by ID:", error);
                throw new Error("Failed to fetch horario by ID");
            }
        });
    }
    getAllHorarios() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horarios = yield this.horarioRepository.find();
                return horarios.map(horario => this.toDomain(horario));
            }
            catch (error) {
                console.error("Error fetching all horarios:", error);
                throw new Error("Failed to fetch all horarios");
            }
        });
    }
    getHorariosByDocente(docenteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horarios = yield this.horarioRepository.find({ where: { docente_id: docenteId } });
                return horarios.map(horario => this.toDomain(horario));
            }
            catch (error) {
                console.error("Error fetching horarios by docente:", error);
                throw new Error("Failed to fetch horarios by docente");
            }
        });
    }
    getHorariosByCurso(cursoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horarios = yield this.horarioRepository.find({ where: { curso_id: cursoId } });
                return horarios.map(horario => this.toDomain(horario));
            }
            catch (error) {
                console.error("Error fetching horarios by curso:", error);
                throw new Error("Failed to fetch horarios by curso");
            }
        });
    }
}
exports.HorarioAdapter = HorarioAdapter;
//# sourceMappingURL=HorarioAdapter.js.map