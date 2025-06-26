import { Router } from "express";
import { HorarioController } from "../controller/HorarioController";
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

//Inicialización del controlador (sin parámetros ya que no tiene constructor)
const horarioController = new HorarioController();

// Rutas específicas por docente
router.get("/docente/:docenteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getHorariosByDocente(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios del docente", error });
  }
});

// Rutas para estudiantes por horario
router.get("/horarios/:id/estudiantes", authenticateToken, async (req, res) => {
  try {
    await horarioController.getEstudiantesPorHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estudiantes del horario", error });
  }
});

// Rutas para asistencias
router.post("/asistencias", authenticateToken, async (req, res) => {
  try {
    await horarioController.registrarAsistencia(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar asistencia", error });
  }
});

// Rutas para crear horarios
router.post("/horarios", authenticateToken, async (req, res) => {
  try {
    await horarioController.crearHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el horario", error });
  }
});

// Rutas para editar horarios
router.put("/horarios/:id", authenticateToken, async (req, res) => {
  try {
    await horarioController.editarHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el horario", error });
  }
});

// Rutas para horarios por día
router.get("/horarios-por-dia", authenticateToken, async (req, res) => {
  try {
    await horarioController.getHorariosPorDia(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios por día", error });
  }
});

// Rutas para inscripciones por estudiante
router.get("/inscripciones/:estudianteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getInscripcionesPorEstudiante(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener inscripciones del estudiante", error });
  }
});

// Rutas para cancelar inscripción
router.put("/inscripciones/:id/cancelar", authenticateToken, async (req, res) => {
  try {
    await horarioController.cancelarInscripcion(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar inscripción", error });
  }
});

// Rutas para crear inscripción
router.post("/inscripciones", authenticateToken, async (req, res) => {
  try {
    await horarioController.crearInscripcion(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear inscripción", error });
  }
});

// Rutas para clases impartidas por docente
router.get("/clases-impartidas/:docenteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getClasesImpartidasPorDocente(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener clases impartidas", error });
  }
});

// Rutas para todas las inscripciones enriquecidas
router.get("/inscripciones-enriquecidas", authenticateToken, async (req, res) => {
  try {
    await horarioController.getAllInscripcionesEnriched(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener inscripciones enriquecidas", error });
  }
});

// Rutas para estadísticas
router.get("/estadisticas-asistencia/:estudianteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getEstadisticasAsistenciaPorEstudiante(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas de asistencia", error });
  }
});

// Rutas para estudiantes por horario
router.get('/:id/estudiantes', authenticateToken, async (req, res) => {
  await horarioController.getEstudiantesPorHorario(req, res);
});

// Ruta para crear un horario
router.post('/', authenticateToken, async (req, res) => {
  await horarioController.crearHorario(req, res);
});

// Ruta para eliminar un horario
router.delete('/:id', authenticateToken, async (req, res) => {
  await horarioController.deleteHorario(req, res);
});

export default router; 