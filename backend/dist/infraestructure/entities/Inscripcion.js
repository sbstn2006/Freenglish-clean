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
exports.Inscripcion = void 0;
const typeorm_1 = require("typeorm");
let Inscripcion = class Inscripcion {
};
exports.Inscripcion = Inscripcion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inscripcion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "estudiante_id" }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "estudiante_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "horario_id" }),
    __metadata("design:type", Number)
], Inscripcion.prototype, "horario_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "fecha_inscripcion", type: "date", default: () => "CURRENT_DATE" }),
    __metadata("design:type", String)
], Inscripcion.prototype, "fecha_inscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "estado", type: "varchar", length: 20, default: () => "'activa'" }),
    __metadata("design:type", String)
], Inscripcion.prototype, "estado", void 0);
exports.Inscripcion = Inscripcion = __decorate([
    (0, typeorm_1.Entity)({ name: "inscripciones", schema: "freenglish" })
], Inscripcion);
//# sourceMappingURL=Inscripcion.js.map