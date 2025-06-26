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
exports.AsistenciaApplicationService = void 0;
class AsistenciaApplicationService {
    constructor(port) {
        this.port = port;
    }
    createAsistencia(asistencia) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validaciones de negocio
                if (!asistencia.estudiante_id || !asistencia.horario_id || !asistencia.fecha) {
                    throw new Error('estudiante_id, horario_id y fecha son requeridos');
                }
                // Verificar que la fecha no sea futura
                const fechaAsistencia = new Date(asistencia.fecha);
                const fechaActual = new Date();
                if (fechaAsistencia > fechaActual) {
                    throw new Error('No se puede registrar asistencia para fechas futuras');
                }
                // Verificar si ya existe una asistencia para este estudiante en este horario y fecha
                const existeAsistencia = yield this.port.checkAsistenciaExists(asistencia.estudiante_id, asistencia.horario_id, fechaAsistencia);
                if (existeAsistencia) {
                    throw new Error('Ya existe un registro de asistencia para este estudiante en esta fecha');
                }
                // Establecer presente por defecto si no se proporciona
                if (asistencia.presente === undefined) {
                    asistencia.presente = true;
                }
                return yield this.port.createAsistencia(asistencia);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.createAsistencia:", error);
                throw error;
            }
        });
    }
    updateAsistencia(id, asistencia) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAsistencia = yield this.port.getAsistenciaById(id);
                if (!existingAsistencia) {
                    throw new Error('Asistencia not found');
                }
                // Validaciones de negocio para actualización
                if (asistencia.fecha) {
                    const fechaAsistencia = new Date(asistencia.fecha);
                    const fechaActual = new Date();
                    if (fechaAsistencia > fechaActual) {
                        throw new Error('No se puede actualizar asistencia para fechas futuras');
                    }
                }
                return yield this.port.updateAsistencia(id, asistencia);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.updateAsistencia:", error);
                throw error;
            }
        });
    }
    deleteAsistencia(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.deleteAsistencia(id);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.deleteAsistencia:", error);
                throw new Error("Failed to delete asistencia");
            }
        });
    }
    getAsistenciaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAsistenciaById(id);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAsistenciaById:", error);
                throw new Error("Failed to fetch asistencia by ID");
            }
        });
    }
    getAllAsistencias() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAllAsistencias();
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAllAsistencias:", error);
                throw new Error("Failed to fetch all asistencias");
            }
        });
    }
    getAsistenciasByEstudiante(estudianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAsistenciasByEstudiante(estudianteId);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAsistenciasByEstudiante:", error);
                throw new Error("Failed to fetch asistencias by estudiante");
            }
        });
    }
    getAsistenciasByHorario(horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAsistenciasByHorario(horarioId);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAsistenciasByHorario:", error);
                throw new Error("Failed to fetch asistencias by horario");
            }
        });
    }
    getAsistenciasByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAsistenciasByFecha(fecha);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAsistenciasByFecha:", error);
                throw new Error("Failed to fetch asistencias by fecha");
            }
        });
    }
    getAsistenciasByEstudianteAndHorario(estudianteId, horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAsistenciasByEstudianteAndHorario(estudianteId, horarioId);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.getAsistenciasByEstudianteAndHorario:", error);
                throw new Error("Failed to fetch asistencias by estudiante and horario");
            }
        });
    }
    checkAsistenciaExists(estudianteId, horarioId, fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.checkAsistenciaExists(estudianteId, horarioId, fecha);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.checkAsistenciaExists:", error);
                throw new Error("Failed to check asistencia exists");
            }
        });
    }
    // Método de utilidad para marcar asistencia
    marcarAsistencia(estudianteId_1, horarioId_1, fecha_1) {
        return __awaiter(this, arguments, void 0, function* (estudianteId, horarioId, fecha, presente = true) {
            try {
                const asistencia = {
                    estudiante_id: estudianteId,
                    horario_id: horarioId,
                    fecha: fecha,
                    presente: presente
                };
                return yield this.port.createAsistencia(asistencia);
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.marcarAsistencia:", error);
                throw error;
            }
        });
    }
    // Método de utilidad para calcular porcentaje de asistencia
    calcularPorcentajeAsistencia(estudianteId, horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const asistencias = yield this.getAsistenciasByEstudianteAndHorario(estudianteId, horarioId);
                if (asistencias.length === 0)
                    return 0;
                const asistenciasPresentes = asistencias.filter(a => a.presente).length;
                return (asistenciasPresentes / asistencias.length) * 100;
            }
            catch (error) {
                console.error("Error in AsistenciaApplicationService.calcularPorcentajeAsistencia:", error);
                throw new Error("Failed to calculate attendance percentage");
            }
        });
    }
}
exports.AsistenciaApplicationService = AsistenciaApplicationService;
//# sourceMappingURL=AsistenciaApplicationService.js.map