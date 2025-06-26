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
exports.ActividadApplicationService = void 0;
class ActividadApplicationService {
    constructor(port) {
        this.port = port;
    }
    createActividad(actividad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.createActividad(actividad);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.createActividad:", error);
                throw new Error("Failed to create actividad");
            }
        });
    }
    updateActividad(id, actividad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingActividad = yield this.port.getActividadById(id);
                if (!existingActividad) {
                    throw new Error('Actividad not found');
                }
                return yield this.port.updateActividad(id, actividad);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.updateActividad:", error);
                throw new Error("Failed to update actividad");
            }
        });
    }
    deleteActividad(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.deleteActividad(id);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.deleteActividad:", error);
                throw new Error("Failed to delete actividad");
            }
        });
    }
    getActividadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getActividadById(id);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.getActividadById:", error);
                throw new Error("Failed to fetch actividad by ID");
            }
        });
    }
    getAllActividades() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getAllActividades();
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.getAllActividades:", error);
                throw new Error("Failed to fetch all actividades");
            }
        });
    }
    getActividadesByUsuario(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getActividadesByUsuario(usuarioId);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.getActividadesByUsuario:", error);
                throw new Error("Failed to fetch actividades by usuario");
            }
        });
    }
    getActividadesByFecha(fecha) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.port.getActividadesByFecha(fecha);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.getActividadesByFecha:", error);
                throw new Error("Failed to fetch actividades by fecha");
            }
        });
    }
    getActividadesRecientes() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                return yield this.port.getActividadesRecientes(limit);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.getActividadesRecientes:", error);
                throw new Error("Failed to fetch actividades recientes");
            }
        });
    }
    // Método de utilidad para registrar actividades del sistema
    registrarActividad(usuarioId, accion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actividad = {
                    usuario_id: usuarioId,
                    accion: accion,
                    fecha: new Date()
                };
                return yield this.port.createActividad(actividad);
            }
            catch (error) {
                console.error("Error in ActividadApplicationService.registrarActividad:", error);
                throw new Error("Failed to register actividad");
            }
        });
    }
}
exports.ActividadApplicationService = ActividadApplicationService;
//# sourceMappingURL=ActividadApplicationService.js.map