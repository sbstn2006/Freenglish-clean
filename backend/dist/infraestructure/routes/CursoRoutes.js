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
const CursoAdapter_1 = require("../adapter/CursoAdapter");
const CursoApplicationService_1 = require("../../application/CursoApplicationService");
const CursoController_1 = require("../controller/CursoController");
const authMiddleware_1 = require("../web/authMiddleware");
const router = (0, express_1.Router)();
// Inicialización de las capas
const cursoAdapter = new CursoAdapter_1.CursoAdapter();
const cursoAppService = new CursoApplicationService_1.CursoApplicationService(cursoAdapter);
const cursoController = new CursoController_1.CursoController(cursoAppService);
// Rutas públicas (sin autenticación)
router.get('/cursos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.getAllCursos(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos", error });
    }
}));
router.get('/cursos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.getCursoById(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el curso", error });
    }
}));
router.get('/cursos/:id/with-schedules', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.getCursoByIdWithSchedules(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el curso con horarios", error });
    }
}));
router.get('/cursos/nivel/:nivel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.getCursosByNivel(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos por nivel", error });
    }
}));
// Rutas protegidas (con autenticación)
router.post('/cursos', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.createCurso(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear el curso", error });
    }
}));
router.put('/cursos/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.updateCurso(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el curso", error });
    }
}));
router.delete('/cursos/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cursoController.deleteCurso(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar el curso", error });
    }
}));
exports.default = router;
//# sourceMappingURL=CursoRoutes.js.map