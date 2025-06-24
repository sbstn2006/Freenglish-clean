"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curso = void 0;
const typeorm_1 = require("typeorm");
let Curso = class Curso {
};
exports.Curso = Curso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Curso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "titulo", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Curso.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "descripcion", type: "text" }),
    __metadata("design:type", String)
], Curso.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "nivel", type: "varchar", length: 10 }),
    __metadata("design:type", String)
], Curso.prototype, "nivel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "slug", type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Curso.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "duracion", type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Curso.prototype, "duracion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "estado", type: "varchar", length: 20, default: () => "'activo'" }),
    __metadata("design:type", String)
], Curso.prototype, "estado", void 0);
exports.Curso = Curso = __decorate([
    (0, typeorm_1.Entity)({ name: "cursos", schema: "freenglish" })
], Curso);
//# sourceMappingURL=Curso.js.map