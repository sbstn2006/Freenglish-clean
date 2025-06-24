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
exports.ActividadReciente = void 0;
const typeorm_1 = require("typeorm");
let ActividadReciente = class ActividadReciente {
};
exports.ActividadReciente = ActividadReciente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ActividadReciente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "usuario_id" }),
    __metadata("design:type", Number)
], ActividadReciente.prototype, "usuario_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "accion", type: "text" }),
    __metadata("design:type", String)
], ActividadReciente.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "fecha", type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], ActividadReciente.prototype, "fecha", void 0);
exports.ActividadReciente = ActividadReciente = __decorate([
    (0, typeorm_1.Entity)({ name: "actividad_reciente", schema: "freenglish" })
], ActividadReciente);
//# sourceMappingURL=ActividadReciente.js.map