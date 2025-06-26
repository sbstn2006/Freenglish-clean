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
exports.InscripcionApplicationService = void 0;
class InscripcionApplicationService {
    constructor(port) {
        this.port = port;
    }
    createInscripcion(inscripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validaciones de negocio
                if (!inscripcion.estudiante_id || !inscripcion.horario_id) {
                    throw new Error('estudiante_id y horario_id son requeridos');
                }
                // Verificar si ya existe una inscripción para este estudiante en este horario
                const existeInscripcion = yield this.port.checkInscripcionExists(inscripcion.estudiante_id, inscripcion.horario_id);
                if (existeInscripcion) {
                    throw new Error('El estudiante ya está inscrito en este horario');
                }
                // Establecer fecha de inscripción si no se proporciona
                if (!inscripcion.fecha_inscripcion) {
                    inscripcion.fecha_inscripcion = new Date();
                }
                // Establecer estado por defecto
                if (!inscripcion.estado) {
                    inscripcion.estado = 'activa';
                }
                return yield this.port.createInscripcion(inscripcion);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.createInscripcion:", error);
                throw error;
            }
        });
    }
    updateInscripcion(id, inscripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingInscripcion = yield this.port.getInscripcionById(id);
                if (!existingInscripcion) {
                    throw new Error('Inscripcion not found');
                }
                // Validaciones de negocio para actualización
                if (inscripcion.estado && !['activa', 'cancelada', 'completada'].includes(inscripcion.estado)) {
                    throw new Error('Estado de inscripción no válido');
                }
                return yield this.port.updateInscripcion(id, inscripcion);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.updateInscripcion:", error);
                throw error;
            }
        });
    }
    deleteInscripcion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.deleteInscripcion(id);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.deleteInscripcion:", error);
                throw new Error("Failed to delete inscripcion");
            }
        });
    }
    getInscripcionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getInscripcionById(id);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.getInscripcionById:", error);
                throw new Error("Failed to fetch inscripcion by ID");
            }
        });
    }
    getAllInscripciones() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAllInscripciones();
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.getAllInscripciones:", error);
                throw new Error("Failed to fetch all inscripciones");
            }
        });
    }
    getInscripcionesByEstudiante(estudianteId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getInscripcionesByEstudiante(estudianteId);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.getInscripcionesByEstudiante:", error);
                throw new Error("Failed to fetch inscripciones by estudiante");
            }
        });
    }
    getInscripcionesByHorario(horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getInscripcionesByHorario(horarioId);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.getInscripcionesByHorario:", error);
                throw new Error("Failed to fetch inscripciones by horario");
            }
        });
    }
    checkInscripcionExists(estudianteId, horarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.checkInscripcionExists(estudianteId, horarioId);
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.checkInscripcionExists:", error);
                throw new Error("Failed to check inscripcion exists");
            }
        });
    }
    // Método de utilidad para cancelar inscripción
    cancelarInscripcion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.updateInscripcion(id, { estado: 'cancelada' });
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.cancelarInscripcion:", error);
                throw error;
            }
        });
    }
    // Método de utilidad para activar inscripción
    activarInscripcion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.updateInscripcion(id, { estado: 'activa' });
            }
            catch (error) {
                console.error("Error in InscripcionApplicationService.activarInscripcion:", error);
                throw error;
            }
        });
    }
}
exports.InscripcionApplicationService = InscripcionApplicationService;
//# sourceMappingURL=InscripcionApplicationService.js.map