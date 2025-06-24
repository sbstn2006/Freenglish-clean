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
// Rutas públicas (sin autenticación)
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.login(req, res);
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.createUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error en la creación del usuario", error });
    }
}));
// Rutas protegidas (con autenticación)
router.put('/users/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.updateUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar al usuario", error });
    }
}));
router.get('/users', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getAllUsers(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
}));
router.get('/users/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getUserById(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
}));
router.get('/users-mail/:email', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getUserByEmail(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario por email", error });
    }
}));
router.delete('/users/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.deleteUser(req, res);
    }
    catch (error) {
        res.status(400).json({ message: "Error al eliminar el usuario", error });
    }
}));
// Ruta de prueba
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map