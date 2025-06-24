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
exports.CursoAdapter = void 0;
const Curso_1 = require("../entities/Curso");
const data_base_1 = require("../config/data-base");
class CursoAdapter {
    constructor() {
        this.repo = data_base_1.AppDataSource.getRepository(Curso_1.Curso);
    }
    createCurso(curso) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCurso = this.repo.create(curso);
            const saved = yield this.repo.save(newCurso);
            return saved.id;
        });
    }
    getCursoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.repo.findOneBy({ id });
            return found ? found : null;
        });
    }
    getAllCursos() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.repo.find());
        });
    }
    updateCurso(id, curso) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.update(id, curso);
            return result.affected === 1;
        });
    }
    deleteCurso(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete(id);
            return result.affected === 1;
        });
    }
}
exports.CursoAdapter = CursoAdapter;
//# sourceMappingURL=CursoAdapter.js.map