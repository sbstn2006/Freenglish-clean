import { Router } from 'express';
import { CursoAdapter } from '../adapter/CursoAdapter';
import { CursoApplicationService } from '../../application/CursoApplicationService';
import { CursoController } from '../controller/CursoController';
import { authenticateToken } from '../web/authMiddleware';

const router = Router();

// Inicialización de las capas
const cursoAdapter = new CursoAdapter();
const cursoAppService = new CursoApplicationService(cursoAdapter);
const cursoController = new CursoController(cursoAppService);

// Rutas públicas (sin autenticación)
router.get('/cursos', async (req, res) => {
    try {
        await cursoController.getAllCursos(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos", error });
    }
});

router.get('/cursos/:id', async (req, res) => {
    try {
        await cursoController.getCursoById(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el curso", error });
    }
});

router.get('/cursos/:id/with-schedules', async (req, res) => {
    try {
        await cursoController.getCursoByIdWithSchedules(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el curso con horarios", error });
    }
});

router.get('/cursos/nivel/:nivel', async (req, res) => {
    try {
        await cursoController.getCursosByNivel(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos por nivel", error });
    }
});

// Rutas protegidas (con autenticación)
router.post('/cursos', authenticateToken, async (req, res) => {
    try {
        await cursoController.createCurso(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el curso", error });
    }
});

router.put('/cursos/:id', authenticateToken, async (req, res) => {
    try {
        await cursoController.updateCurso(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el curso", error });
    }
});

router.delete('/cursos/:id', authenticateToken, async (req, res) => {
    try {
        await cursoController.deleteCurso(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el curso", error });
    }
});

export default router; 