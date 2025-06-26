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
const ActividadAdapter_1 = require("../adapter/ActividadAdapter");
const ActividadApplicationService_1 = require("../../application/ActividadApplicationService");
const ActividadController_1 = require("../controller/ActividadController");
const authMiddleware_1 = require("../web/authMiddleware");
const router = (0, express_1.Router)();
//Inicialización de las capas
const actividadAdapter = new ActividadAdapter_1.ActividadAdapter();
const actividadAppService = new ActividadApplicationService_1.ActividadApplicationService(actividadAdapter);
const actividadController = new ActividadController_1.ActividadController(actividadAppService);
//Definir las rutas con el manejo de errores
router.post('/actividades', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.createActividad(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la creación de la actividad", error });
    }
}));
router.put('/actividades/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.updateActividad(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar la actividad", error });
    }
}));
router.get('/actividades', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.getAllActividades(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades", error });
    }
}));
router.get('/actividades/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.getActividadById(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener la actividad", error });
    }
}));
router.get('/actividades-recientes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.getActividadesRecientes(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades recientes", error });
    }
}));
router.get('/actividades-usuario/:usuarioId', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.getActividadesByUsuario(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener las actividades del usuario", error });
    }
}));
router.delete('/actividades/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield actividadController.deleteActividad(req, res);
    }
    catch (error) {
        res.status(400).json({ message: "Error al eliminar la actividad", error });
    }
}));
exports.default = router;
//# sourceMappingURL=ActividadRoutes.js.map