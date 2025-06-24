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
exports.CursoApplicationService = void 0;
class CursoApplicationService {
    constructor(port) {
        this.port = port;
    }
    crearCurso(curso) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.createCurso(curso);
        });
    }
    obtenerCursoPorId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.getCursoById(id);
        });
    }
    obtenerTodosLosCursos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.getAllCursos();
        });
    }
    actualizarCurso(id, curso) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.updateCurso(id, curso);
        });
    }
    eliminarCurso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.port.deleteCurso(id);
        });
    }
}
exports.CursoApplicationService = CursoApplicationService;
//# sourceMappingURL=CursoApplicationService.js.map