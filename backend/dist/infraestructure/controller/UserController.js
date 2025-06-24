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
exports.UserController = void 0;
class UserController {
    constructor(app) {
        this.app = app;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({ error: "Error en email y contraseña" });
                }
                const token = yield this.app.login(email, password);
                return res.status(200).json({ message: "Login Exitoso", token });
            }
            catch (error) {
                return res.status(401).json({ error: "Error en credenciales" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                // Validaciones con expresiones regulares
                if (!/^[A-Za-z\s]{3,}$/.test(name.trim()))
                    return res
                        .status(400)
                        .json({
                        error: "El nombre debe tener al menos 3 caracteres y solo contener letras",
                    });
                if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()))
                    return res.status(400).json({ error: "Correo electrónico no válido" });
                if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.trim()))
                    return res
                        .status(400)
                        .json({
                        error: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
                    });
                // Crear usuario
                const user = { name, email, password, role: "estudiante", status: "activo" };
                const userId = yield this.app.createUser(user);
                return res
                    .status(201)
                    .json({ message: "Usuario creado con éxito", userId });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res
                        .status(500)
                        .json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const user = yield this.app.getUserById(id);
                if (!user)
                    return res.status(404).json({ error: "Usuario no encontrado" });
                return res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res
                        .status(500)
                        .json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!/^[^\s@]+@[^\s@+]+\.[^\s@+]+$/.test(email))
                    return res.status(400).json({ error: "Correo electrónico no válido" });
                //Validación de email exitosa procedemos a buscar el usuario por email
                const user = yield this.app.getUserByEmail(email);
                if (!user)
                    return res.status(404).json({ error: "Usuario no encontrado" });
                return res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res
                        .status(500)
                        .json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.app.getAllUsers();
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los usuarios" });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const deleted = yield this.app.deleteUser(id);
                if (!deleted)
                    return res.status(404).json({ error: "Usuario no encontrado" });
                return res.status(200).json({ message: "Usuario eliminado con éxito" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al eliminar el usuario" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                let { name, email, password } = req.body;
                // Validaciones con expresiones regulares
                if (name && !/^[A-Za-z\s]{3,}$/.test(name.trim()))
                    return res
                        .status(400)
                        .json({
                        error: "El nombre debe tener al menos 3 caracteres y solo contener letras",
                    });
                if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()))
                    return res.status(400).json({ error: "Correo electrónico no válido" });
                if (password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password.trim()))
                    return res
                        .status(400)
                        .json({
                        error: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número",
                    });
                const updated = yield this.app.updateUser(id, {
                    name,
                    email,
                    password
                });
                if (!updated)
                    return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
                return res.status(200).json({ message: "Usuario actualizado con éxito" });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res
                        .status(500)
                        .json({
                        error: "Error interno del servidor",
                        details: error.message,
                    });
                }
                return res.status(500).json({ error: "Error interno del servidor" });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map