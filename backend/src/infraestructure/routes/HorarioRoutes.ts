import { Router } from "express";
import { HorarioController } from "../controller/HorarioController";
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

//Inicialización del controlador (sin parámetros ya que no tiene constructor)
const horarioController = new HorarioController();

// Ruta para obtener todos los horarios
router.get("/", authenticateToken, async (req, res) => {
  try {
    await horarioController.getAllHorarios(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener todos los horarios", error });
  }
});

// Ruta para crear un horario
router.post('/', authenticateToken, async (req, res) => {
  try {
    await horarioController.crearHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el horario", error });
  }
});

// Ruta para eliminar un horario
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await horarioController.deleteHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el horario", error });
  }
});

// Rutas específicas por docente
router.get("/docente/:docenteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getHorariosByDocente(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios del docente", error });
  }
});

// Rutas para editar horarios
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    await horarioController.editarHorario(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el horario", error });
  }
});

// Rutas para estudiantes por horario
router.get('/:id/estudiantes', authenticateToken, async (req, res) => {
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

// Ruta para crear inscripciones
router.post("/inscripciones", authenticateToken, async (req, res) => {
  try {
    await horarioController.crearInscripcion(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la inscripción", error });
  }
});

// Ruta para obtener inscripciones por estudiante
router.get("/inscripciones/:estudianteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getInscripcionesPorEstudiante(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener inscripciones del estudiante", error });
  }
});

// Ruta para cancelar inscripción
router.put("/inscripciones/:id/cancelar", authenticateToken, async (req, res) => {
  try {
    await horarioController.cancelarInscripcion(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar la inscripción", error });
  }
});

// Rutas para horarios por día
router.get("/por-dia", authenticateToken, async (req, res) => {
  try {
    await horarioController.getHorariosPorDia(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener horarios por día", error });
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

// Rutas para estadísticas de asistencia
router.get("/estadisticas-asistencia/:estudianteId", authenticateToken, async (req, res) => {
  try {
    await horarioController.getEstadisticasAsistenciaPorEstudiante(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas de asistencia", error });
  }
});

export default router; 