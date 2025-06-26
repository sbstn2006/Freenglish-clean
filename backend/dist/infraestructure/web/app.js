"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const AuthRoutes_1 = __importDefault(require("../routes/AuthRoutes"));
const EstudianteRoutes_1 = __importDefault(require("../routes/EstudianteRoutes"));
const DocenteRoutes_1 = __importDefault(require("../routes/DocenteRoutes"));
const UserRoutes_1 = __importDefault(require("../routes/UserRoutes")); // Rutas de compatibilidad
const CursoRoutes_1 = __importDefault(require("../routes/CursoRoutes"));
const HorarioRoutes_1 = __importDefault(require("../routes/HorarioRoutes"));
const ContactRoutes_1 = __importDefault(require("../routes/ContactRoutes"));
const InscripcionRoutes_1 = __importDefault(require("../routes/InscripcionRoutes"));
const ActividadRoutes_1 = __importDefault(require("../routes/ActividadRoutes"));
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: environment_vars_1.default.CORS_ORIGIN || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        // Rutas de autenticación (nuevas)
        this.app.use("/api/auth", AuthRoutes_1.default);
        // Rutas de gestión de usuarios por rol (nuevas)
        this.app.use("/api/admin", EstudianteRoutes_1.default);
        this.app.use("/api/admin", DocenteRoutes_1.default);
        // Rutas de compatibilidad (mantener funcionamiento actual)
        this.app.use("/api", UserRoutes_1.default);
        // Rutas de contenido
        this.app.use("/api", CursoRoutes_1.default);
        this.app.use("/api/horarios", HorarioRoutes_1.default);
        this.app.use("/api/inscripciones", InscripcionRoutes_1.default);
        this.app.use("/api", ActividadRoutes_1.default);
        this.app.use("/api", ContactRoutes_1.default);
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({ message: 'Backend funcionando correctamente' });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.default = new App().getApp();
//# sourceMappingURL=app.js.map