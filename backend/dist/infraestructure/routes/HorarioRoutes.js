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
const HorarioController_1 = require("../controller/HorarioController");
const authMiddleware_1 = require("../web/authMiddleware");
const router = (0, express_1.Router)();
//Inicialización del controlador (sin parámetros ya que no tiene constructor)
const horarioController = new HorarioController_1.HorarioController();
// Rutas específicas por docente
router.get("/docente/:docenteId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getHorariosByDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener horarios del docente", error });
    }
}));
// Rutas para estudiantes por horario
router.get("/horarios/:id/estudiantes", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getEstudiantesPorHorario(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener estudiantes del horario", error });
    }
}));
// Rutas para asistencias
router.post("/asistencias", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.registrarAsistencia(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al registrar asistencia", error });
    }
}));
// Rutas para crear horarios
router.post("/horarios", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.crearHorario(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear el horario", error });
    }
}));
// Rutas para editar horarios
router.put("/horarios/:id", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.editarHorario(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al actualizar el horario", error });
    }
}));
// Rutas para horarios por día
router.get("/horarios-por-dia", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getHorariosPorDia(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener horarios por día", error });
    }
}));
// Rutas para inscripciones por estudiante
router.get("/inscripciones/:estudianteId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getInscripcionesPorEstudiante(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener inscripciones del estudiante", error });
    }
}));
// Rutas para cancelar inscripción
router.put("/inscripciones/:id/cancelar", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.cancelarInscripcion(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al cancelar inscripción", error });
    }
}));
// Rutas para crear inscripción
router.post("/inscripciones", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.crearInscripcion(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear inscripción", error });
    }
}));
// Rutas para clases impartidas por docente
router.get("/clases-impartidas/:docenteId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getClasesImpartidasPorDocente(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener clases impartidas", error });
    }
}));
// Rutas para todas las inscripciones enriquecidas
router.get("/inscripciones-enriquecidas", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getAllInscripcionesEnriched(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener inscripciones enriquecidas", error });
    }
}));
// Rutas para estadísticas
router.get("/estadisticas-asistencia/:estudianteId", authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield horarioController.getEstadisticasAsistenciaPorEstudiante(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas de asistencia", error });
    }
}));
exports.default = router;
//# sourceMappingURL=HorarioRoutes.js.map