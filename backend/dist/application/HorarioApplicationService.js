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
exports.HorarioApplicationService = void 0;
class HorarioApplicationService {
    constructor(port) {
        this.port = port;
    }
    createHorario(horario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validaciones de negocio
                if (horario.hora_inicio >= horario.hora_fin) {
                    throw new Error('La hora de inicio debe ser anterior a la hora de fin');
                }
                if (horario.max_estudiantes <= 0) {
                    throw new Error('El número máximo de estudiantes debe ser mayor a 0');
                }
                const diasValidos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
                if (!diasValidos.includes(horario.dia_semana.toLowerCase())) {
                    throw new Error('Día de la semana no válido');
                }
                return yield this.port.createHorario(horario);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.createHorario:", error);
                throw error;
            }
        });
    }
    updateHorario(id, horario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingHorario = yield this.port.getHorarioById(id);
                if (!existingHorario) {
                    throw new Error('Horario not found');
                }
                // Validaciones de negocio para actualización
                if (horario.hora_inicio && horario.hora_fin && horario.hora_inicio >= horario.hora_fin) {
                    throw new Error('La hora de inicio debe ser anterior a la hora de fin');
                }
                if (horario.max_estudiantes !== undefined && horario.max_estudiantes <= 0) {
                    throw new Error('El número máximo de estudiantes debe ser mayor a 0');
                }
                if (horario.dia_semana) {
                    const diasValidos = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
                    if (!diasValidos.includes(horario.dia_semana.toLowerCase())) {
                        throw new Error('Día de la semana no válido');
                    }
                }
                return yield this.port.updateHorario(id, horario);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.updateHorario:", error);
                throw error;
            }
        });
    }
    deleteHorario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.deleteHorario(id);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.deleteHorario:", error);
                throw new Error("Failed to delete horario");
            }
        });
    }
    getHorarioById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getHorarioById(id);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.getHorarioById:", error);
                throw new Error("Failed to fetch horario by ID");
            }
        });
    }
    getAllHorarios() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAllHorarios();
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.getAllHorarios:", error);
                throw new Error("Failed to fetch all horarios");
            }
        });
    }
    getHorariosByDocente(docenteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getHorariosByDocente(docenteId);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.getHorariosByDocente:", error);
                throw new Error("Failed to fetch horarios by docente");
            }
        });
    }
    getHorariosByCurso(cursoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getHorariosByCurso(cursoId);
            }
            catch (error) {
                console.error("Error in HorarioApplicationService.getHorariosByCurso:", error);
                throw new Error("Failed to fetch horarios by curso");
            }
        });
    }
}
exports.HorarioApplicationService = HorarioApplicationService;
//# sourceMappingURL=HorarioApplicationService.js.map