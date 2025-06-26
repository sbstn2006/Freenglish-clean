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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Curso_1 = require("../entities/Curso");
const Horario_1 = require("../entities/Horario");
const Inscripcion_1 = require("../entities/Inscripcion");
const Asistencia_1 = require("../entities/Asistencia");
const ActividadReciente_1 = require("../entities/ActividadReciente");
const environment_vars_1 = __importDefault(require("./environment-vars"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: environment_vars_1.default.DB_HOST,
    port: environment_vars_1.default.DB_PORT,
    username: environment_vars_1.default.DB_USER,
    password: environment_vars_1.default.DB_PASSWORD,
    database: "freenglish_db",
    schema: environment_vars_1.default.DB_SCHEMA,
    synchronize: true,
    logging: true,
    entities: [User_1.User, Curso_1.Curso, Horario_1.Horario, Inscripcion_1.Inscripcion, Asistencia_1.Asistencia, ActividadReciente_1.ActividadReciente]
});
//Conectar a la base de datos
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.AppDataSource.initialize();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
//# sourceMappingURL=data-base.js.map