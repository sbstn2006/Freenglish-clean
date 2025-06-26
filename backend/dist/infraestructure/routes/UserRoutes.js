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
// Rutas públicas (sin autenticación) - COMPATIBILIDAD
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
// Ruta pública para obtener docentes (sin autenticación) - COMPATIBILIDAD
router.get('/docentes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getDocentes(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener los docentes", error });
    }
}));
// Rutas públicas para gestión de docentes (sin autenticación) - COMPATIBILIDAD
router.put('/docentes/:id/activar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.activateDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al activar docente", error });
    }
}));
router.put('/docentes/:id/rechazar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.rechazarDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al rechazar docente", error });
    }
}));
router.put('/docentes/:id/actualizar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.updateDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar docente", error });
    }
}));
// Rutas protegidas (con autenticación) - COMPATIBILIDAD
router.put('/users/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.updateUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar al usuario", error });
    }
}));
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Rutas para gestión de docentes pendientes - COMPATIBILIDAD
router.get('/pending-docentes', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.getPendingDocentes(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener docentes pendientes", error });
    }
}));
router.put('/activate-docente/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.activateDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al activar docente", error });
    }
}));
// Ruta de prueba - COMPATIBILIDAD
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API funcionando correctamente' });
});
// Ruta para actividades recientes - COMPATIBILIDAD
router.get('/actividades-recientes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { AppDataSource } = require('../config/data-base');
    const ActividadReciente = require('../entities/ActividadReciente').ActividadReciente;
    const User = require('../entities/User').User;
    try {
        const actividades = yield AppDataSource.getRepository(ActividadReciente).find({ order: { fecha: 'DESC' } });
        // Obtener ids únicos de usuario
        const usuarioIds = [...new Set(actividades.map((a) => a.usuario_id))];
        const usuarios = yield AppDataSource.getRepository(User).findByIds(usuarioIds);
        const usuariosMap = Object.fromEntries(usuarios.map((u) => [u.id, u]));
        // Enriquecer actividades
        const actividadesEnriquecidas = actividades.map((a) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, a), { nombre: ((_a = usuariosMap[a.usuario_id]) === null || _a === void 0 ? void 0 : _a.name) || '', email: ((_b = usuariosMap[a.usuario_id]) === null || _b === void 0 ? void 0 : _b.email) || '' }));
        });
        res.json(actividadesEnriquecidas);
    }
    catch (e) {
        res.status(500).json({ error: 'Error al obtener actividades recientes' });
    }
}));
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map