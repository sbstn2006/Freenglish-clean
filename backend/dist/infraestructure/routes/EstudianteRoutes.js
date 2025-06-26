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
const UserAdapter_1 = require("../adapter/UserAdapter");
const UserApplicationService_1 = require("../../application/UserApplicationService");
const UserController_1 = require("../controller/UserController");
const authMiddleware_1 = require("../web/authMiddleware");
const router = (0, express_1.Router)();
//Inicialización de las capas
const userAdapter = new UserAdapter_1.UserAdapter();
const userAppService = new UserApplicationService_1.UserApplicationService(userAdapter);
const userController = new UserController_1.UserController(userAppService);
// Rutas para gestión de estudiantes (solo admin)
router.get('/estudiantes', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getAllUsers(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los estudiantes", error });
    }
}));
router.get('/estudiantes/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getUserById(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el estudiante", error });
    }
}));
router.put('/estudiantes/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.updateUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el estudiante", error });
    }
}));
router.delete('/estudiantes/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.deleteUser(req, res);
    }
    catch (error) {
        res.status(400).json({ message: "Error al eliminar el estudiante", error });
    }
}));
exports.default = router;
//# sourceMappingURL=EstudianteRoutes.js.map