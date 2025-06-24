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
exports.Horario = void 0;
const typeorm_1 = require("typeorm");
let Horario = class Horario {
};
exports.Horario = Horario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Horario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "curso_id" }),
    __metadata("design:type", Number)
], Horario.prototype, "curso_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "docente_id" }),
    __metadata("design:type", Number)
], Horario.prototype, "docente_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "dia_semana", type: "varchar", length: 20 }),
    __metadata("design:type", String)
], Horario.prototype, "dia_semana", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "hora_inicio", type: "time" }),
    __metadata("design:type", String)
], Horario.prototype, "hora_inicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "hora_fin", type: "time" }),
    __metadata("design:type", String)
], Horario.prototype, "hora_fin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "max_estudiantes", type: "int" }),
    __metadata("design:type", Number)
], Horario.prototype, "max_estudiantes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "estado", type: "varchar", length: 20, default: () => "'activo'" }),
    __metadata("design:type", String)
], Horario.prototype, "estado", void 0);
exports.Horario = Horario = __decorate([
    (0, typeorm_1.Entity)({ name: "horarios", schema: "freenglish" })
], Horario);
//# sourceMappingURL=Horario.js.map