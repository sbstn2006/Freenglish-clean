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
                const result = yield this.app.login(email, password);
                if (result) {
                    // Bloquear login de docentes pendientes
                    if (result.user.role === 'docente' && result.user.status === 'pendiente') {
                        return res.status(401).json({ error: 'Tu cuenta está pendiente de aprobación por el administrador. Recibirás una notificación cuando sea aprobada.' });
                    }
                    return res.status(200).json({
                        message: "Login Exitoso",
                        user: {
                            id: result.user.id,
                            name: result.user.name,
                            email: result.user.email,
                            role: result.user.role,
                            status: result.user.status
                        },
                        token: result.token
                    });
                }
                else {
                    return res.status(401).json({ error: "Error en credenciales" });
                }
            }
            catch (error) {
                if (error instanceof Error && error.message.includes('pendiente')) {
                    return res.status(401).json({ error: error.message });
                }
                return res.status(401).json({ error: "Error en credenciales" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
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
                // Validar rol
                if (!role || !['estudiante', 'docente', 'admin'].includes(role)) {
                    return res.status(400).json({ error: "Rol debe ser 'estudiante', 'docente' o 'admin'" });
                }
                // Crear usuario con rol y estado apropiado
                const user = {
                    name,
                    email,
                    password,
                    role: role,
                    status: role === 'docente' ? 'pendiente' : 'activo'
                };
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
                // Registrar actividad
                yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: id,
                    accion: `Usuario eliminado por el admin`,
                    fecha: new Date()
                });
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
                // Crear objeto con solo los campos presentes
                const updateData = {};
                if (name !== undefined)
                    updateData.name = name;
                if (email !== undefined)
                    updateData.email = email;
                if (password !== undefined)
                    updateData.password = password;
                const updated = yield this.app.updateUser(id, updateData);
                if (!updated)
                    return res.status(404).json({ error: "Usuario no encontrado o sin cambios" });
                // Registrar actividad
                yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: id,
                    accion: `Usuario editado por el admin`,
                    fecha: new Date()
                });
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
    activateDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const activated = yield this.app.activateDocente(id);
                if (!activated)
                    return res.status(404).json({ error: "Docente no encontrado" });
                // Enviar correo de notificación de activación
                try {
                    const user = yield this.app.getUserById(id);
                    if (user && user.email) {
                        const { sendMail } = require('../adapter/MailService');
                        yield sendMail({
                            to: user.email,
                            subject: 'Tu cuenta de docente ha sido activada',
                            text: `Hola ${user.name}, tu cuenta de docente ha sido activada. Ya puedes iniciar sesión y comenzar a usar la plataforma.`
                        });
                    }
                }
                catch (mailError) {
                    console.error('Error enviando correo de activación:', mailError);
                }
                // Registrar actividad
                yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: id,
                    accion: `Docente aceptado por el admin`,
                    fecha: new Date()
                });
                return res.status(200).json({ message: "Docente activado con éxito" });
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
    getPendingDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pendingDocentes = yield this.app.getPendingDocentes();
                return res.status(200).json(pendingDocentes);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los docentes pendientes" });
            }
        });
    }
    getDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.app.getAllUsers();
                const docentes = allUsers.filter(user => user.role === 'docente');
                // Importar aquí para evitar problemas circulares
                const { AppDataSource } = require('../config/data-base');
                const Horario = require('../entities/Horario').Horario;
                const Inscripcion = require('../entities/Inscripcion').Inscripcion;
                const { In } = require('typeorm');
                // Enriquecer cada docente con cursos y estudiantes
                const docentesEnriquecidos = yield Promise.all(docentes.map((docente) => __awaiter(this, void 0, void 0, function* () {
                    // Cursos (horarios) donde es docente
                    const horarios = yield AppDataSource.getRepository(Horario).find({ where: { docente_id: docente.id } });
                    const cursosCount = horarios.length;
                    // IDs de horarios
                    const horarioIds = horarios.map((h) => h.id);
                    let estudiantesCount = 0;
                    if (horarioIds.length > 0) {
                        estudiantesCount = yield AppDataSource.getRepository(Inscripcion)
                            .count({ where: { horario_id: In(horarioIds) } });
                    }
                    return Object.assign(Object.assign({}, docente), { courses: cursosCount, students: estudiantesCount });
                })));
                return res.status(200).json(docentesEnriquecidos);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al obtener los docentes" });
            }
        });
    }
    rechazarDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const updated = yield this.app.updateUser(id, { status: 'rejected' });
                if (!updated)
                    return res.status(404).json({ error: "Docente no encontrado" });
                // Enviar correo de notificación de rechazo
                try {
                    const user = yield this.app.getUserById(id);
                    if (user && user.email) {
                        const { sendMail } = require('../adapter/MailService');
                        yield sendMail({
                            to: user.email,
                            subject: 'Tu cuenta de docente ha sido rechazada',
                            text: `Hola ${user.name}, lamentamos informarte que tu cuenta de docente ha sido rechazada. Si tienes dudas, puedes contactar al administrador.`
                        });
                    }
                }
                catch (mailError) {
                    console.error('Error enviando correo de rechazo:', mailError);
                }
                // Registrar actividad
                yield require('../config/data-base').AppDataSource.getRepository(require('../entities/ActividadReciente').ActividadReciente).save({
                    usuario_id: id,
                    accion: `Docente rechazado por el admin`,
                    fecha: new Date()
                });
                return res.status(200).json({ message: "Docente rechazado con éxito" });
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
    updateDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                let { name, email, status } = req.body;
                // Validaciones con expresiones regulares
                if (name && !/^[A-Za-z\s]{3,}$/.test(name.trim()))
                    return res
                        .status(400)
                        .json({
                        error: "El nombre debe tener al menos 3 caracteres y solo contener letras",
                    });
                if (email && !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()))
                    return res.status(400).json({ error: "Correo electrónico no válido" });
                const updated = yield this.app.updateUser(id, {
                    name,
                    email,
                    status
                });
                if (!updated)
                    return res.status(404).json({ error: "Docente no encontrado o sin cambios" });
                return res.status(200).json({ message: "Docente actualizado con éxito" });
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
    getAllDocentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allUsers = yield this.app.getAllUsers();
                const docentes = allUsers.filter(user => user.role === 'docente');
                return res.status(200).json(docentes);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener los docentes" });
            }
        });
    }
    getDocenteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const user = yield this.app.getUserById(id);
                if (!user || user.role !== 'docente')
                    return res.status(404).json({ error: "Docente no encontrado" });
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ error: "Error al obtener el docente" });
            }
        });
    }
    createDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                // Validaciones
                if (!name || !email || !password) {
                    return res.status(400).json({ error: "Faltan datos obligatorios" });
                }
                const user = {
                    name,
                    email,
                    password,
                    role: 'docente',
                    status: 'pendiente'
                };
                const userId = yield this.app.createUser(user);
                return res.status(201).json({ message: "Docente creado con éxito", userId });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al crear el docente" });
            }
        });
    }
    deleteDocente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id))
                    return res.status(400).json({ error: "ID inválido, el ID debe ser un número" });
                const user = yield this.app.getUserById(id);
                if (!user || user.role !== 'docente')
                    return res.status(404).json({ error: "Docente no encontrado" });
                const deleted = yield this.app.deleteUser(id);
                if (!deleted)
                    return res.status(404).json({ error: "Docente no encontrado" });
                return res.status(200).json({ message: "Docente eliminado con éxito" });
            }
            catch (error) {
                return res.status(500).json({ error: "Error al eliminar el docente" });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map