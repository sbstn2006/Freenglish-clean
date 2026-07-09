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
const express_1 = require("express");
const InscripcionController_1 = require("../controller/InscripcionController");
const authMiddleware_1 = require("../web/authMiddleware");
const router = (0, express_1.Router)();
const inscripcionController = new InscripcionController_1.InscripcionController();
// Obtener todas las inscripciones
router.get('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.getAllInscripciones(req, res);
}));
// Obtener inscripción por ID
router.get('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.getInscripcionById(req, res);
}));
// Crear nueva inscripción
router.post('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.createInscripcion(req, res);
}));
// Actualizar inscripción
router.put('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.updateInscripcion(req, res);
}));
// Eliminar inscripción
router.delete('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.deleteInscripcion(req, res);
}));
// Obtener todas las inscripciones enriquecidas
router.get('/inscripcionesb/all-enriched', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield inscripcionController.getAllInscripcionesEnriched(req, res);
}));
exports.default = router;
//# sourceMappingURL=InscripcionRoutes.js.map