import { Router } from 'express';
import { InscripcionController } from '../controller/InscripcionController';
import { authenticateToken } from '../web/authMiddleware';

const router = Router();
const inscripcionController = new InscripcionController();

// Obtener todas las inscripciones
router.get('/', authenticateToken, async (req, res) => {
  await inscripcionController.getAllInscripciones(req, res);
});

// Obtener inscripción por ID
router.get('/:id', authenticateToken, async (req, res) => {
  await inscripcionController.getInscripcionById(req, res);
});

// Crear nueva inscripción
router.post('/', authenticateToken, async (req, res) => {
  await inscripcionController.createInscripcion(req, res);
});

// Actualizar inscripción
router.put('/:id', authenticateToken, async (req, res) => {
  await inscripcionController.updateInscripcion(req, res);
});

// Eliminar inscripción
router.delete('/:id', authenticateToken, async (req, res) => {
  await inscripcionController.deleteInscripcion(req, res);
});

// Obtener todas las inscripciones enriquecidas
router.get('/inscripcionesb/all-enriched', authenticateToken, async (req, res) => {
  await inscripcionController.getAllInscripcionesEnriched(req, res);
});

export default router; 